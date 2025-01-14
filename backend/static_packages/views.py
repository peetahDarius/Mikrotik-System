from django.shortcuts import render
from rest_framework import generics, mixins
from .serializers import StaticPackageSerializer
from .models import StaticPackage
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class ListCreateStaticPackageView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    serializer_class = StaticPackageSerializer
    queryset = StaticPackage.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDestroyStaticPackageView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = StaticPackageSerializer
    queryset = StaticPackage.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)