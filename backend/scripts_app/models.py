from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('user',  'User'),
        ('admin', 'Admin'),
    ]
    role       = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_blocked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"


class PodcastScript(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('published', 'Published'),
    ]
    owner      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scripts')
    title      = models.CharField(max_length=200)
    topic      = models.CharField(max_length=200)
    content    = models.TextField()
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class AIHistory(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_history')
    prompt     = models.TextField()
    result     = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.user.username}] {self.prompt[:50]}"
