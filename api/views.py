from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from .serializer import UserSerializer, ProjectSerializer
from django.core.mail import send_mail
from django.conf import settings
from .models import User, Project
from django.shortcuts import get_object_or_404, render, redirect

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
            return Response({"message": "Registration successful. Please check your email to activate your account."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        unique_code = request.data.get('unique_code')
        password = request.data.get('password')

        user = authenticate(username=unique_code, password=password)

        if user is not None:
            if user.is_active:
                return Response({"message": "Login successful", "full_name": user.full_name}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Account not activated. Please check your email."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

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
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project created successfully."}, status=status.HTTP_201_CREATED)
        else: 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectListView(ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer