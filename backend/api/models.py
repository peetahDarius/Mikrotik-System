from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager

# Create your models here.

class CustomUserManager(UserManager):

    def _create_user(self, username, first_name, last_name, email, password, **extra_fields):
        if not username:
            raise ValueError("username is required")
        if not email:
            raise ValueError("email is required")
        if not first_name:
            raise ValueError("first_name is required")
        if not last_name:
            raise ValueError("last_name is required")
        if not password:
            raise ValueError("password is required")
        
        email = self.normalize_email(email)
        user = self.model(username=username, first_name=first_name, last_name=last_name, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, first_name, last_name, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_active", True)
        return self._create_user(username, first_name, last_name, email, password, **extra_fields)

    def create_superuser(self, username, first_name, last_name, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(username, first_name, last_name, email, password, **extra_fields)
    
    

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=254, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=254, unique=True)
    phone = models.CharField(null=True, blank=True, max_length=50)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "first_name", "last_name"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "User"

    def get_full_name(self):
        full_name = f"{self.first_name} {self.last_name}"
        return full_name

    def get_short_name(self):
        return self.first_name
