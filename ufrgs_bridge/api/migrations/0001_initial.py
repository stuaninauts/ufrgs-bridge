# Generated by Django 5.0.4 on 2024-04-24 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.CharField(default='', max_length=5, primary_key=True, serialize=False, unique=True)),
                ('mentor', models.CharField(default='', max_length=50)),
                ('title', models.CharField(default='', max_length=50)),
                ('weekly_hours', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
