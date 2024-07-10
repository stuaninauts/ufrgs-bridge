from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import User, Project

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'unique_code', 'full_name', 'role', 'is_admin')
    list_filter = ('is_admin', 'role')
    fieldsets = (
        (None, {'fields': ('email', 'unique_code', 'full_name', 'password')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'unique_code', 'full_name', 'password1', 'password2', 'role', 'is_admin'),
        }),
    )
    search_fields = ('email', 'unique_code', 'full_name')
    ordering = ('email',)
    filter_horizontal = ()

admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
admin.site.register(Project)
