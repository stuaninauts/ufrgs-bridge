from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError

def validate_ufrgs_email(value):
    if not value.endswith('@ufrgs.br'):
        raise ValidationError('Email must end with @ufrgs.br')

class UserManager(BaseUserManager):
    def create_user(self, email, unique_code, full_name, password=None, role=None):
        if not email:
            raise ValueError('The Email field must be set')
        if not unique_code:
            raise ValueError('The Unique Code field must be set')
        if not full_name:
            raise ValueError('The Full Name field must be set')
        if not role:
            raise ValueError('The Role field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, unique_code=unique_code, full_name=full_name, role=role)
        user.set_password(password)
        user.is_active = False  # Set is_active to False initially
        user.save(using=self._db)
        return user

    def create_superuser(self, email, unique_code, full_name, password=None):
        user = self.create_user(email, unique_code, full_name, password, role='admin')
        user.is_admin = True
        #user.is_staff = True
        user.is_superuser = True
        user.is_active = True  # Superuser should be active by default
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('tech', 'Tech'),
        ('professor', 'Professor'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True, validators=[validate_ufrgs_email])
    unique_code = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    activation_token = models.CharField(max_length=32, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'unique_code'
    REQUIRED_FIELDS = ['email', 'full_name']

    def __str__(self):
        return self.full_name

    @property
    def is_staff(self):
        return self.is_admin
    
    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=1000)
    contactEmail = models.EmailField()
    
    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title