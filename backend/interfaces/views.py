from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from api.router_requests import interceptor_requests

# Create your views here.

@api_view(["GET"])
@permission_classes([IsAuthenticated,])
def get_interfaces(request:Request):
    try:
        response = interceptor_requests("get", path="interface")
        data = response.json()
        return Response(data=data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{e}"}, status=status.HTTP_404_NOT_FOUND)