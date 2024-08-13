# Generated by Django 4.2.15 on 2024-08-12 21:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_applicationresponse_status_project_members'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicationform',
            name='additional_questions',
            field=models.TextField(blank=True, help_text='Questões complementares adicionadas pelo professor:', null=True),
        ),
        migrations.AlterField(
            model_name='applicationform',
            name='questions',
            field=models.TextField(default='Qual é a sua barra de ingresso?, Você possui experiência prévia na área do projeto?, Por que você está interessado nesse projeto?'),
        ),
    ]