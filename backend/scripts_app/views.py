from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PodcastScript, AIHistory, User
from .serializers import (
    UserSerializer, RegisterSerializer,
    PodcastScriptSerializer, AIHistorySerializer,
)
from .permissions import IsAdminRole, IsOwnerOrAdmin
from .ai_service import generate_script


# ── Helper ────────────────────────────────────────────────────
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
        'user': {
            'id':       user.id,
            'username': user.username,
            'email':    user.email,
            'role':     user.role,
        }
    }


# ── Auth ──────────────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(get_tokens(user), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password'),
        )
        if user is None:
            return Response(
                {'error': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if user.is_blocked:
            return Response(
                {'error': 'Your account has been blocked. Contact support.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return Response(get_tokens(user))


class MeView(APIView):
    """Return the currently logged-in user's info."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ── PodcastScript CRUD ────────────────────────────────────────
class ScriptListCreateView(generics.ListCreateAPIView):
    serializer_class   = PodcastScriptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return PodcastScript.objects.all()
        return PodcastScript.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ScriptDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = PodcastScriptSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return PodcastScript.objects.all()
        return PodcastScript.objects.filter(owner=self.request.user)


# ── AI ────────────────────────────────────────────────────────
class AIGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt', '').strip()
        if not prompt:
            return Response({'error': 'Prompt is required.'}, status=400)

        result = generate_script(prompt)

        # Auto-save to history
        AIHistory.objects.create(
            user=request.user,
            prompt=prompt,
            result=result,
        )

        return Response({'result': result})


class AIHistoryView(generics.ListAPIView):
    serializer_class   = AIHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIHistory.objects.filter(user=self.request.user)[:10]


# ── Admin ─────────────────────────────────────────────────────
class AdminUserListView(generics.ListAPIView):
    queryset           = User.objects.all().order_by('id')
    serializer_class   = UserSerializer
    permission_classes = [IsAdminRole]


class AdminBlockUserView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        if user.role == 'admin':
            return Response({'error': 'Cannot block another admin.'}, status=400)

        user.is_blocked = not user.is_blocked
        user.save()
        return Response({
            'id':         user.id,
            'username':   user.username,
            'is_blocked': user.is_blocked,
        })
