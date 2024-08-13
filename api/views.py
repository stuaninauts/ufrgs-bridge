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
                'Ative sua conta UFRGS-Bridge',
                f'Olá, sua conta está quase pronta, clique no link para ativá-la: {activation_link}',
                "oficialufrgs@outlook.com",
                [user.email],
                fail_silently=False,
            )
            token = Token.objects.create(user=user)
            return Response({"message": "Registro feito com sucesso. Cheque seu email para ativar sua conta.",
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
        return render(request, 'frontend/account_activated.html')

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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ProjectSearchView(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.query_params.get('q', None)
        if query:
            projects = Project.objects.filter(title__icontains=query)
        else:
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
    
class ApplicationFormDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        form = ApplicationForm.objects.filter(project=project).first()
        if not form:
            return Response({"error": "No application form found for this project."}, status=status.HTTP_404_NOT_FOUND)

        questions = form.get_full_questions()
        return Response({"questions": questions}, status=status.HTTP_200_OK)
    

class ApplyToProjectView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project')
        project = get_object_or_404(Project, id=project_id)
        form = ApplicationForm.objects.filter(project=project).first()

        answers_dict = request.data.get('answers')
        answers_text = ', '.join(answers_dict.values())

        if not form:
            return Response({"error": "This project is not open for applications."}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'form': form.id,
            'student': request.user.id,
            'answers': answers_text,
        }

        serializer = ApplicationResponseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Application submitted successfully."}, status=status.HTTP_201_CREATED)
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
        print(serializer.data)
        return Response(serializer.data)

class ApplicationResponseDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        app_response = get_object_or_404(ApplicationResponse, pk=pk)
        
        student_name = app_response.student.full_name
        project_title = app_response.form.project.title
        answers = app_response.answers
        status = app_response.status

        student = get_object_or_404(User, id=app_response.student.id)
        project = get_object_or_404(Project, id=app_response.form.project.id)

        response_data = {
            'student_name': student_name,
            'project_title': project_title,
            'answers': answers,
            'status': status
        }

        status = request.data.get('action')
        if status in ['accepted', 'rejected']:
            app_response.status = status
            app_response.save()
            msg = f"Your application for {app_response.form.project.title} has been {status}."
            if status == 'accepted':
                project.members.add(student)
                project = Project.objects.get(id=project.id)
                print(project.members.all())
            return Response({"message": msg})

        return Response({"message": "Response updated successfully."})
    
class UserProjectsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        projects = Project.objects.none()
        user = request.user
        if user.role == 'professor':
            projects = Project.objects.filter(created_by=user)
        elif user.role == 'student':
            projects = Project.objects.filter(members=user)
            
        project_data = [{'title': project.title, 'description': project.description} for project in projects]

        return Response({'projects': project_data})

class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'email': getattr(user, 'email', None),
            'unique_code': getattr(user, 'unique_code', None),
            'full_name': getattr(user, 'full_name', None),
            'role': getattr(user, 'role', None),
        }
        return Response(user_data)
    
class EditProjectView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):

        token, created = Token.objects.get_or_create(user=request.user)
        print(token);

        project = get_object_or_404(Project, id=project_id)
        if project.created_by != request.user:
            return Response({"error": "You are not authorized to edit this project."}, status=status.HTTP_403_FORBIDDEN)

        data = {
            'title': request.data.get('newTitle'),
            'description': request.data.get('newDescription'),
            'contactEmail': request.data.get('newContactEmail'),
        }

        serializer = ProjectSerializer(project, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project updated successfully.", "token": token.key,}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)