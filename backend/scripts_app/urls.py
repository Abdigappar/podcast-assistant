from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/',  views.RegisterView.as_view()),
    path('auth/login/',     views.LoginView.as_view()),
    path('auth/refresh/',   TokenRefreshView.as_view()),
    path('auth/me/',        views.MeView.as_view()),

    # Podcast Scripts
    path('scripts/',            views.ScriptListCreateView.as_view()),
    path('scripts/<int:pk>/',   views.ScriptDetailView.as_view()),

    # AI
    path('ai/generate/',    views.AIGenerateView.as_view()),
    path('ai/history/',     views.AIHistoryView.as_view()),

    # Admin
    path('admin/users/',                    views.AdminUserListView.as_view()),
    path('admin/users/<int:pk>/block/',     views.AdminBlockUserView.as_view()),
]
