from datetime import datetime, timedelta
from .models import AccessPoints, SuccessfullConnection
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from dateutil import parser
from django.db.models import Sum
from collections import defaultdict
from django.db.models.functions import TruncMinute
from django.db.models import Count

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def payments_report(request:Request):
    data = request.data
    time_from = data.get("time_from")
    time_to = data.get("time_to")
    
    if not time_from:
        return Response({"error": {"time_from is required"}}, status=status.HTTP_400_BAD_REQUEST)
    
    if not time_to:
        return Response({"error": {"time_to is required"}}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse ISO 8601 or other date formats
        start_time = parser.parse(time_from)
        end_time = parser.parse(time_to)
    except (ValueError, TypeError) as e:
        return Response({"error": {"message": "Invalid date format", "details": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
    
    if end_time <= start_time:
        return Response({"error": "time_to must be later than time_from"}, status=status.HTTP_400_BAD_REQUEST)
    
    connections = SuccessfullConnection.objects.filter(created_at__gte=start_time, created_at__lte=end_time)
    
    connection_dict = {}

    # Iterate through each connection and count occurrences of each key
    for connection in connections:
        key = (f"{connection.package.name} Hrs: {int(connection.package.minutes/60) if connection.package.minutes else None}", connection.package.amount)
        
        # If the key already exists, increment the count, otherwise set it to 1
        if key in connection_dict:
            connection_dict[key] += 1
        else:
            connection_dict[key] = 1

    final_dict = {}
    for key, value in connection_dict.items():
        name, price = key
        total_amount = value * price
        final_dict.update({name: total_amount})

    return Response(data=final_dict, status=status.HTTP_200_OK)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def payments_time_report(request:Request):
    data = request.data
    time_from = data.get("time_from")
    time_to = data.get("time_to")
    
    if not time_from:
        return Response({"error": {"time_from is required"}}, status=status.HTTP_400_BAD_REQUEST)
    
    if not time_to:
        return Response({"error": {"time_to is required"}}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse ISO 8601 or other date formats
        start_time = parser.parse(time_from)
        end_time = parser.parse(time_to)
    except (ValueError, TypeError) as e:
        return Response({"error": {"message": "Invalid date format", "details": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
    
    if end_time <= start_time:
        return Response({"error": "time_to must be later than time_from"}, status=status.HTTP_400_BAD_REQUEST)

    # Initialize dictionary to store aggregated data
    time_interval = timedelta(minutes=30)  # 30-minute intervals
    report_data = defaultdict(dict)  # Use defaultdict for easier handling of nested data

    # Iterate through each 30-minute interval
    current_time = start_time
    while current_time < end_time:
        next_time = current_time + time_interval

        # Filter connections within the current 30-minute interval
        connections = SuccessfullConnection.objects.filter(
            created_at__gte=current_time,
            created_at__lt=next_time
        )

        # Count the number of payments per package in this interval
        for connection in connections:
            package_name = f"{connection.package.name} Hrs: {int(connection.package.minutes / 60) if connection.package.minutes else None}"

            # Increment the count for the package
            if package_name in report_data[f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}"]:
                report_data[f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}"][package_name] += 1
            else:
                report_data[f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}"][package_name] = 1

        # Move to the next 30-minute interval
        current_time = next_time

    return Response(report_data, status=status.HTTP_200_OK)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def connections_report(request:Request):
    data = request.data
    time_from = data.get("time_from")
    time_to = data.get("time_to")
    
    if not time_from:
        return Response({"error": {"time_from is required"}}, status=status.HTTP_400_BAD_REQUEST)
    
    if not time_to:
        return Response({"error": {"time_to is required"}}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse ISO 8601 or other date formats
        start_time = parser.parse(time_from)
        end_time = parser.parse(time_to)
    except (ValueError, TypeError) as e:
        return Response({"error": {"message": "Invalid date format", "details": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
    
    if end_time <= start_time:
        return Response({"error": "time_to must be later than time_from"}, status=status.HTTP_400_BAD_REQUEST)
    
    connections = SuccessfullConnection.objects.filter(created_at__gte=start_time, created_at__lte=end_time)

    
    connection_dict = {}
    
    for connection in connections:
        key = connection.ap_mac
        
        if key in connection_dict:
            connection_dict[key] += 1
        else:
            connection_dict[key] = 1
            
    final_dict = {}
    
    for a_key, value in connection_dict.items():
        name = AccessPoints.objects.get(mac=a_key).name
        final_dict.update({name: value})
        
    return Response(data=final_dict, status=status.HTTP_200_OK)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def connections_time_report(request: Request):
    data = request.data
    time_from = data.get("time_from")
    time_to = data.get("time_to")
    
    if not time_from:
        return Response({"error": "time_from is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not time_to:
        return Response({"error": "time_to is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse ISO 8601 or other date formats
        start_time = parser.parse(time_from)
        end_time = parser.parse(time_to)
    except (ValueError, TypeError) as e:
        return Response({"error": {"message": "Invalid date format", "details": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
    
    if end_time <= start_time:
        return Response({"error": "time_to must be later than time_from"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Initialize dictionary to store aggregated data
    time_interval = timedelta(minutes=30)  # 30-minute intervals
    report_data = defaultdict(dict)  # Use defaultdict for easier handling of nested data

    # Iterate through each 30-minute interval
    current_time = start_time
    while current_time < end_time:
        next_time = current_time + time_interval

        # Filter connections within the current 30-minute interval
        connections = SuccessfullConnection.objects.filter(
            created_at__gte=current_time,
            created_at__lt=next_time
        )

        # Count the number of successful connections per ap_mac in this interval
        for connection in connections:
            ap_mac = connection.ap_mac

            # Increment the count for the ap_mac
            if ap_mac in report_data[f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}"]:
                report_data[f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}"][ap_mac] += 1
            else:
                report_data[f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}"][ap_mac] = 1

        # Move to the next 30-minute interval
        current_time = next_time
    
    final_dict = {}
    
    for key, value in report_data.items():
        new_dict = {}
        for value_key, value_value in value.items():
            name = AccessPoints.objects.get(mac=value_key).name
            new_dict.update({name: value_value})
        
        updated_dict = {key: new_dict}
        final_dict.update(updated_dict)

    return Response(data=final_dict, status=status.HTTP_200_OK)

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def specific_ap_connections(request: Request):
    data = request.data
    time_from = data.get("time_from")
    time_to = data.get("time_to")
    access_point = data.get("access_point")
    
    if not time_from:
        return Response({"error": "time_from is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not time_to:
        return Response({"error": "time_to is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not access_point:
        return Response({"error": "access_point is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse ISO 8601 or other date formats
        start_time = parser.parse(time_from)
        end_time = parser.parse(time_to)
        
        mac = AccessPoints.objects.get(name=access_point).mac
        
    except AccessPoints.DoesNotExist:
        return Response({"error": f"Access point {access_point} not found"}, status=status.HTTP_404_NOT_FOUND)
    except (ValueError, TypeError) as e:
        return Response({"error": {"message": "Invalid date format", "details": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
    
    if end_time <= start_time:
        return Response({"error": "time_to must be later than time_from"}, status=status.HTTP_400_BAD_REQUEST)
    

    connections = SuccessfullConnection.objects.filter(created_at__gte=start_time, created_at__lte=end_time, ap_mac=mac)
    
    connections_data = []
    
    for connection in connections:
        connection_dict = {
            "created_at": connection.created_at,
            "mac": connection.mac,
            "phone": connection.phone_number,
            "package": f"{connection.package.name} Hrs: {int(connection.package.minutes/60) if connection.package.minutes else None}",
            "up": connection.package.up,
            "down": connection.package.down,
            "byte_quota": connection.package.byte_quota,
            "price": connection.package.amount
        }
        connections_data.append(connection_dict)
        
    return Response(data=connections_data, status=status.HTTP_200_OK)