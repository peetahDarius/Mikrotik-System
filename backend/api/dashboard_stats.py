from datetime import datetime, timedelta
import heapq
import requests
from hotspot_payment.models import Payment
from dhcp_service.models import DHCPService
from ppp_service.models import PPPService
from sms.models import SMSCredentials
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.db.models.functions import TruncMonth

def get_sms_account_data():
    try:
        credentials = SMSCredentials.objects.get(custom_id=1)
        user_id = credentials.user_id
        password = credentials.password
        response = requests.get(f"https://smsportal.hostpinnacle.co.ke/SMSApi/account/readstatus?userid={user_id}&password={password}&output=json")
        data = response.json()["response"]["account"]["smsBalance"]
        return data
    
    except Exception:
        return 0


def get_total_pppoe_clients():
    length = PPPService.objects.all().__len__()
    suspended_clients = PPPService.objects.filter(is_suspended=True).__len__()
    return (length, suspended_clients)


def get_total_dhcp_clients():
    length = DHCPService.objects.all().__len__()
    suspended_clients = DHCPService.objects.filter(is_suspended=True).__len__()
    return (length, suspended_clients)


def get_current_months_total_income():
    now = datetime.now()
    start_of_month = datetime(now.year, now.month, 1)
    all_payments = Payment.objects.filter(created_at__gte=start_of_month)
    total_payments = 0
    for payment in all_payments:
        total_payments += payment
        
    return total_payments


def get_total_hotspot_clients():
    phone_numbers = []
    total_payments = Payment.objects.all()
    for payment in total_payments:
        if payment.phone_number not in phone_numbers:
            phone_numbers.append(payment.phone_number)
            
    return len(phone_numbers)


def get_newest_clients():
    latest_ppp_clients = PPPService.objects.all().order_by("-created_at")[:6]
    latest_dhcp_clients = DHCPService.objects.all().order_by("-created_at")[:6]
    
    merged_clients = heapq.merge(latest_ppp_clients, latest_dhcp_clients, key=lambda x: x.created_at, reverse=True)
    
    data = []
    
    for client in merged_clients:
        try:
            client.profile
            service_type = "PPPoE"
            detail = client.username
        except:
            service_type = "Static"
            detail = client.ip_address
            
        client_data = {
            "names": f"{client.client.first_name} {client.client.last_name}",
            "created_at": client.created_at,
            "service_type": service_type,
            "phone_number": client.client.phone,
            "custom_id": client.client.custom_id,
            "apartment": client.client.apartment,
            "detail": detail,
            "client_id": client.client.pk
        }
        data.append(client_data)
        
    return data[:6]

def get_user_counts_by_month():
    # Get the current date
    today = datetime.now()

    # Calculate the date one year ago
    one_year_ago = today - timedelta(days=365)

    # Filter PPPoE and Static (DHCP) clients created in the past year
    ppp_services = PPPService.objects.filter(created_at__gte=one_year_ago)
    dhcp_services = DHCPService.objects.filter(created_at__gte=one_year_ago)

    # Group PPPoE clients by month and count
    ppp_monthly_data = (
        ppp_services.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    # Group Static (DHCP) clients by month and count
    dhcp_monthly_data = (
        dhcp_services.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    # Prepare the data for the bar graph
    graph_data = []
    months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    # Build data for the past 12 months
    for i in range(12):
        month = (today - timedelta(days=i * 30)).month  # Adjust dynamically for past 12 months
        month_name = months[month - 1]
        
        ppp_count = next((entry['count'] for entry in ppp_monthly_data if entry['month'].month == month), 0)
        dhcp_count = next((entry['count'] for entry in dhcp_monthly_data if entry['month'].month == month), 0)

        graph_data.append({
            'name': month_name,
            'Static': dhcp_count,
            'PPPoE': ppp_count,
        })

    return graph_data

@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def stats(request:Request):
    user_count_per_month = get_user_counts_by_month()
    new_clients = get_newest_clients()
    total_hotspot_clients = get_total_hotspot_clients()
    total_hotspot_income = get_current_months_total_income()
    ppp_services_length, ppp_service_suspended = get_total_pppoe_clients()
    dhcp_services_length, dhcp_service_suspended = get_total_dhcp_clients()
    sms_balance = get_sms_account_data()

    data = {
        "sms_balance": sms_balance,
        "total_dhcp_clients": dhcp_services_length,
        "total_ppp_clients": ppp_services_length,
        "suspended_dhcp_clients": dhcp_service_suspended,
        "suspended_ppp_clients": ppp_service_suspended,
        "total_hotspot_income": total_hotspot_income,
        "total_hotspot_clients": total_hotspot_clients,
        "recent_clients": new_clients,
        "user_count": user_count_per_month
    }
    return Response(data=data, status=status.HTTP_200_OK)