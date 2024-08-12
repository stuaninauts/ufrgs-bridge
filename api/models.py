from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.conf import settings

def validate_ufrgs_email(value):
    if not value.endswith('@ufrgs.br'):
        raise ValidationError('Email precisa acabar com @ufrgs.br')

class UserManager(BaseUserManager):
    def create_user(self, email, unique_code, full_name, password=None, role=None):
        if not email:
            raise ValueError('O campo de Email precisa ser preenchido')
        if not unique_code:
            raise ValueError('O campo de Matrícula precisa ser preenchido')
        if not full_name:
            raise ValueError('O campo de Nome Completo precisa ser preenchido')
        if not role:
            raise ValueError('O campo de Cargo precisa ser preenchido')

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

    #, validators=[validate_ufrgs_email]
    email = models.EmailField(unique=True)
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
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='projects', blank=True)

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title
    
class ApplicationForm(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    questions = models.TextField(default="Qual é a sua barra de ingresso?, Você possui experiência prévia na área do projeto?, Por que você está interessado nesse projeto?")  # Default questions
    additional_questions = models.TextField(blank=True, null=True, help_text="Questões complementares adicionadas pelo professor:")

    def __str__(self):
        return f"Form for {self.project.title}"
    
    def get_full_questions(self):
        default_questions = self.questions.split(',') 
        additional_questions = self.additional_questions.split(',') if self.additional_questions else []
        return default_questions + additional_questions
    
class ApplicationResponse(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    form = models.ForeignKey(ApplicationForm, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answers = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Response by {self.student.full_name} for {self.form.project.title}"