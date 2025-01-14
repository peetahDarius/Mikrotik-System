from datetime import timedelta
from django.db import models
import requests
from requests.auth import HTTPBasicAuth

from client.models import Client

# Create your models here.

class PPPServicePaymentLogs(models.Model):
    amount = models.IntegerField()
    receipt = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    payment_method = models.CharField(max_length=50)
    account = models.ForeignKey(Client, on_delete=models.DO_NOTHING, related_name="payment_logs")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MpesaC2B:
    """This class handles M-Pesa B2C transactions: registering URLs, authorization,
    payment confirmation, URL validation, and payment simulation.

    Attributes:
        __authorization_url: Endpoint for generating authorization details.
        __register_url_endpoint: Endpoint for registering URLs.

    Models:
        _authorization: This is the method that is used to get the access token, that will be used to make requests to
            the Daraja API.
        register_url: This is the method that will be used to register your local server's endpoint. The endpoints
            provided will receive confirmation responses once a transaction has been successful.
        simulate_transaction: Method used to simulate transactions in the Daraja sandbox.
        production_urls: Method used to change the sandbox urls to production urls.
        get_set_urls: Method used to check whether the urls have been set correctly. The method checks the current set urls
    """

    __authorization_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    __register_url_endpoint = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    __simulation_endpoint = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"

    def __init__(self, consumer_key, consumer_secret):
        """Initialize the MpesaB2c instance with consumer key and secret."""

        self.short_code = None
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret

    def _authorization(self):
        """Perform a request to the authorization_url endpoint using the consumer key and secret
        to generate an access token for Daraja API requests.
        Returns:
            string: returns an access token"""
        r = requests.get(
            self.__authorization_url,
            auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret)
        )
        data = r.json()
        return data["access_token"]

    def register_url(self, confirmation_endpoint, validation_endpoint, short_code, response_type="Completed"):
        """Handle requests to the Daraja API to register local endpoints.

        Args:
            confirmation_endpoint (str): Endpoint to receive confirmation requests for transactions.
            validation_endpoint (str): Endpoint used to validate the local endpoint with the Daraja API.
            short_code (str): Business short code (M-Pesa Paybill number).
            response_type (str): Response type for transactions ("Completed" or "Cancelled").

        Returns:
            dict: JSON response confirming whether the URLs have been registered successfully.
        """

        self.short_code = short_code

        headers = {"Authorization": "Bearer %s" % self._authorization()}
        req_body = {
            "ShortCode": self.short_code,
            "ResponseType": response_type,
            "ConfirmationURL": confirmation_endpoint,
            "ValidationURL": validation_endpoint
        }
        response = requests.post(
            self.__register_url_endpoint,
            json=req_body,
            headers=headers
        )
        return response.json()

    def simulate_transaction(self, amount, command_id, bill_ref_no, msisdn):
        """
        This model will be used to simulate transactions to the Daraja C2B app.

        Attributes:
            :param amount: type(str): this is the amount[money] of the transaction
            :param command_id: can either be [CustomerPayBilLOnline]/[CustomerBuyGoodsOnline] which are the clients paybill
                number or till number respectively.
            :param bill_ref_no: This is the bill reference Number. use Testpay if simulating in the Daraja sandbox
            :param msisdn: [phone number]: NB:: THE PHONE NUMBER MUST START WITH 254
            :return: Returns a json response of a successful simulation.
        """
        headers = {"Authorization": "Bearer %s" % self._authorization()}
        request_body = {
            "ShortCode": self.short_code,
            "CommandID": command_id,
            "BillRefNumber": bill_ref_no,
            "Msisdn": msisdn,
            "Amount": amount
        }
        simulate_response = requests.post(self.__simulation_endpoint, json=request_body, headers=headers)
        return simulate_response.json()

    @classmethod
    def production_urls(cls, authorization_url, register_urls_endpoint):
        cls.__authorization_url = authorization_url
        cls.__register_url_endpoint = register_urls_endpoint

    def get_set_urls(self):
        return {"authorization_urls": self.__authorization_url,
                "register_url_endpoint": self.__register_url_endpoint,
                "simulation_endpoint": self.__simulation_endpoint}


class MpesaPayment(models.Model):
    time = models.DateTimeField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.CharField(max_length=50, unique=True)
    client = models.ForeignKey(Client, on_delete=models.DO_NOTHING, related_name="mpesa_payments")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.receipt


class CashPayment(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    client = models.ForeignKey(Client, on_delete=models.DO_NOTHING, related_name="cash_payments")
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return str(self.amount)
    

class PaymentDetails(models.Model):
    short_code = models.CharField(max_length=150)
    acc_no_prefix = models.CharField(max_length=150)
    consumer_key = models.TextField()
    consumer_secret = models.TextField()
    confirmation_url = models.URLField(max_length=200)
    validation_url = models.URLField(max_length=200)
    custom_id = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.short_code