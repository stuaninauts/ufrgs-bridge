from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect

from .models import User, Project
from .models import ApplicationForm, ApplicationResponse

from .serializer import UserSerializer, ProjectSerializer
from .serializer import ApplicationFormSerializer, ApplicationResponseSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            activation_link = f"http://127.0.0.1:8000/api/activate/{user.activation_token}/"
            send_mail(
                'Activate Your Account',
                f'Please click the following link to activate your account: {activation_link}',
                "oficialufrgs@outlook.com",
                [user.email],
                fail_silently=False,
            )
            token = Token.objects.create(user=user)
            return Response({"message": "Registration successful. Please check your email to activate your account.",
                             "token": token.key, "user": serializer.data}, 
                            status=status.HTTP_201_CREATED,)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        unique_code = request.data.get('unique_code')
        password = request.data.get('password')

        user = authenticate(username=unique_code, password=password)
        token, created = Token.objects.get_or_create(user=user)

        if user is not None:
            if user.is_active:
                return Response({"message": "Login feito com sucesso",
                                 "full_name": user.full_name,
                                 "token": token.key,
                                 "role": user.role}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Conta não ativada. Por favor, cheque seu email."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Credenciais inválidas!"}, status=status.HTTP_400_BAD_REQUEST)


class ActivateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        user = get_object_or_404(User, activation_token=token)
        if user.is_active:
            return Response({"message": "Account already activated."}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = True
        user.activation_token = None  # Clear the activation token after activation
        user.save()
        return Response({"message": "Account activated successfully."}, status=status.HTTP_200_OK)

class ProjectCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'contactEmail': request.data.get('contactEmail'),
            'created_by': request.user.id
        }

        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project created successfully."}, status=status.HTTP_201_CREATED)
        else: 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectMyListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(created_by=request.user.id)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ProjectAllListView(APIView):

    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
class ApplicationFormCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project')
        additional_questions = request.data.get('additional_questions')  
        print(additional_questions)

        existing_form = ApplicationForm.objects.filter(project=project_id).first()

        data = {
            'project': project_id,
            'additional_questions': additional_questions 
        }

        if existing_form:
            serializer = ApplicationFormSerializer(existing_form, data=data, partial=True)
        else:
            serializer = ApplicationFormSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            if existing_form:
                message = "Application form updated successfully."
            else:
                message = "Application form created successfully."
            return Response({"message": message}, status=status.HTTP_201_CREATED if not existing_form else status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicationResponseListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id, created_by=request.user.id)
        forms = ApplicationForm.objects.filter(project=project)
        responses = ApplicationResponse.objects.filter(form__in=forms)
        serializer = ApplicationResponseSerializer(responses, many=True)
        return Response(serializer.data)
    