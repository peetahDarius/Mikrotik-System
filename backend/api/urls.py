from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("user/register/", views.CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("user/<int:pk>/", views.RetrieveUpdateDeleteUserView.as_view(), name="retrieve-update-delete-user"),
    path("user/change-password-prompt/", views.change_password_email_prompt, name="change-password-prompt"),
    path("user/change-password/", views.change_password, name="change-password"),
    path("user/forgot-password/", views.check_email_for_password, name="check-email-for-password"),
]
