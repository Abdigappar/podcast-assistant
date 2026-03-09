from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PodcastScript, AIHistory

admin.site.register(User, UserAdmin)
admin.site.register(PodcastScript)
admin.site.register(AIHistory)
