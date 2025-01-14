"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from api.dashboard_stats import stats

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path("api/", include("api.urls") ),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/clients/dhcp/', include('dhcp_service.urls')),
    path('api/clients/ppp/', include('ppp_service.urls')),
    path('api/clients/', include('client.urls')),
    path('api/ppp/profiles/', include('ppp_profile.urls')),
    path('api/router/', include('router.urls')),
    path('api/send-sms/', include('sms.urls')),
    path('api/ppp/server/', include('ppp_server.urls')),
    path('api/interfaces/', include('interfaces.urls')),
    path('api/pool/', include('pool.urls')),
    path('api/payments/', include("payment.urls")),
    path('api/ip/addresses/', include("ip_addresses.urls")),
    path('api/static/queue/', include("static_queue.urls")),
    path('api/dhcp/', include("dhcp_server.urls")),
    path('api/static/packages/', include("static_packages.urls")),
    path("api/emails/", include("emails.urls")),
    path("api/hotspot/packages/", include("hotspot_packages.urls")),
    path("api/hotspot/payment/", include("hotspot_payment.urls")),
    path("api/hotspot/", include("hotspot.urls")),
    path("api/dashboard/", stats, name="stats"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
