from django.shortcuts import render
from rest_framework import generics, mixins
from .serializers import PackageSerializer
from .models import Package
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.

class ListCreatePackageView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    queryset = Package.objects.all().order_by("minutes")
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    serializer_class = PackageSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        print(request.data)
        return self.create(request, *args, **kwargs)
    
    
class RetrieveUpdateEditDestroyPackageView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    queryset = Package.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    serializer_class = PackageSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)