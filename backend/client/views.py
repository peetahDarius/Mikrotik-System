from django.shortcuts import render

from sms.models import CreateClientSMS
from sms.views import bulk_sms, render_template
from .models import Client
from .serializers import AllServicesClientSerializer, ClientSerializer
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request


# Create your views here.

class ListCreateClientsView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        phone = request.data.get("phone")
        
        try:
            template_text = CreateClientSMS.objects.get(custom_id=1).message
        except CreateClientSMS.DoesNotExist:
            return Response({"error": "Create Client SMS has not been set"}, status=status.HTTP_404_NOT_FOUND)
        
        context = {"first_name": first_name, "last_name": last_name}
        rendered_text = render_template(template_text=template_text, context=context)
        bulk_sms(mobile_list=[phone,], message=rendered_text)
        
        return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDestroyClientView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def get_services_for_single_client(request:Request, pk):
    if pk:
        try:
            client = Client.objects.get(pk=pk)
            serializer = AllServicesClientSerializer(instance=client, context={"request": request})
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({'error': 'Client not found'}, status=404)
    else:
        return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)