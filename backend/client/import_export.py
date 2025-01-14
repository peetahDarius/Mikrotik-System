import pandas as pd
from django.http import HttpResponse
from .models import Client
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status

def export_profiles_csv(request):
    # Get all clients and exclude the 'full_name' and 'username' properties
    profiles = Client.objects.all().values('first_name', 'last_name', 'phone', 'email', 'custom_id', 'county', 'location', 'apartment', 'house_no', 'longitude', 'latitude', 'balance')
    
    # Convert the QuerySet to a list of dictionaries
    profiles_list = list(profiles)
    
    # Add 'full_name' and 'username' to each dictionary
    for profile in profiles_list:
        profile['full_name'] = f"{profile['first_name']} {profile['last_name']}"
        profile['username'] = profile['email']  # Assuming username is same as email

    # Convert the list of dictionaries to a DataFrame
    df = pd.DataFrame(profiles_list)

    # Create the CSV response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=profiles.csv'
    df.to_csv(path_or_buf=response, index=False)

    return response


@csrf_exempt
@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def import_profiles_csv(request):
    # Log request.FILES to check if the file is being received
    print("Request FILES: ", request.FILES)
    
    # Get the file from the request
    file = request.FILES.get('file')
    
    print("The file is: ", file)  # Log the file to check if it exists
    
    if not file:
        return Response({'error': 'No file part'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        df = pd.read_csv(file)  # Reading the CSV file directly from the request
        for index, row in df.iterrows():
            Client.objects.create(
                first_name=row.get('first_name', ''),
                last_name=row.get('last_name', ''),
                email=row.get('email', ''),
                phone=row.get('phone', ''),
                custom_id=row.get('custom_id', ''),
                location=row.get('location', ''),
                apartment=row.get('apartment', ''),
                house_no=row.get('house_no', ''),
                longitude=row.get('longitude', ''),
                latitude=row.get('latitude', ''),
                balance=row.get('balance', 0),
                county=row.get('county', ''),
            )
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


