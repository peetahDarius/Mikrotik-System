from django.db import models

# Create your models here.

import base64
from datetime import datetime
from json import JSONDecodeError

import requests
from requests.auth import HTTPBasicAuth


class MpesaExpress:
    """This class handles M-Pesa Express transactions.
    This is the module whereby an stk push is sent to the client and a transaction is initialized.

    ================ here how it works ===============================
    1.   The Merchant(Partner) captures and sets the API required parameters and sends the API request.
    2.   The API receives the request and validates it internally first, then sends you an acknowledgment response.
    3.   Through API Proxy an STK Push trigger request is sent to the M-PESA registered phone number of the customer's making the payment.
    4.   The customer confirms by entering their M-PESA PIN.
    5.   The response is sent back to M-PESA and is processed as below:
        a)    M-PESA validates the customer's PIN
        b)      M-PESA debits the customer's Mobile Wallet.
        c)      M-PESA credits the Merchant (Partner) account.

    6.   Once the request is processed send the RESULTS back to the API Management system which is then forwarded to the
        merchant via the callback URL specified in the REQUEST.
    7.   The customer receives an SMS confirmation message of the payment.

    Attributes:
        __authorization_url: Endpoint for generating authorization details.

    Models:
        _authorization: This is the method that is used to get the access token, that will be used to make requests to
            the Daraja API.
    """

    __authorization_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    __stk_initiate_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    def __init__(self, consumer_key, consumer_secret):
        """Initialize the MpesaB2c instance with consumer key and secret."""

        self.short_code = None
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret

    def _authorization(self):
        """Perform a request to the authorization_url endpoint using the consumer key and secret
        to generate an access token for Daraja API requests.
        Returns:
            string: returns an access token
            """
        try:
            r = requests.get(
                self.__authorization_url,
                auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret)
            )
            data = r.json()
            return data["access_token"]
        except JSONDecodeError:
            return {"error": "invalid/expired consumer_key & consumer_secret"}

    def _stk_initiate(self, amount, phone_number, callback_url, account_reference, transaction_desc, transaction_type,
                      short_code, pass_key, party_b):
        """
        This is the method that actually sends the request to the safaricom stk_initiate endpoint

        :param amount: Amount of money to be sent
        :param phone_number: clients Phone number
        :param callback_url: The url that will receive MPESA's response
        :param account_reference: The name of the business' mpesa account
        :param transaction_desc: This is a short description of the transaction
        :param transaction_type: Can either be [CustomerPayBillOnline] or [CustomerBuyGoodsOnline]
        :param short_code: This is the business short code. it is usually provided on production. For testing, you can
            use the one provided in the safaricom sandbox.
        :param pass_key: This is a pass key. it is usually provided on production. For testing, you can
            use the one provided in the safaricom sandbox
        :param party_b: PartyB is usually provided on production. For testing, you can
            use the one provided in the safaricom sandbox
        :return: returns json response for the stk initialization
        """
        access_token = self._authorization()
        phone = self.phone_number_parser(phone_number=phone_number)

        if phone is None:
            return {"error": "invalid phone number"}
        headers = {"Authorization": "Bearer %s" % access_token}
        password, times = self.password_generator(short_code=short_code, pass_key=pass_key)

        data = {
            "BusinessShortCode": short_code,
            "Password": password.decode('utf-8'),
            "Timestamp": times,
            "TransactionType": transaction_type,
            "PartyA": phone,
            "PartyB": party_b,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc,
            "Amount": amount,
        }
        res = requests.post(self.__stk_initiate_url, json=data, headers=headers)
        return res.json()

    @staticmethod
    def phone_number_parser(phone_number):
        """
        Parses the phone number and corrects the phone number's format
        :param phone_number: The client's phone number
        :return: returns the clients phone number in the following format [254***********]
        """
        if phone_number[:2] == "07":
            new_no = "254" + phone_number[1:]
            return new_no
        elif phone_number[:2] == "01":
            new_no = "254" + phone_number[1:]
            return new_no
        elif phone_number[:3] == "+25":
            new_no = phone_number[1:]
            return new_no
        elif phone_number[:3] == "254":
            return phone_number
        else:
            return None

    @staticmethod
    def password_generator(short_code, pass_key):
        """
        Accepts the business shortcode and the pass key and then generates a password.
        :param short_code: The business short code
        :param pass_key: This is provided by the safaricom daraja API
        :return: returns a password
        """
        Timestamp = datetime.now()
        times = Timestamp.strftime("%Y%m%d%H%M%S")
        passwd = short_code + pass_key + times
        password = base64.b64encode(passwd.encode('utf-8'))
        return password, times

    @classmethod
    def production_urls(cls, authorization_url, stk_initiate_url):
        """
        changes the set[sandbox] urls to safaricom production urls
        :param authorization_url: This is the Daraja authorization endpoint
        :param stk_initiate_url: This is the stk initiate endpoints
        :return: sets the above urls
        """
        cls.__authorization_url = authorization_url
        cls.__stk_initiate_url = stk_initiate_url

    def get_set_urls(self):
        """
        prints out the current Safaricom endpoints
        :return: returns the set Safaricom endpoints [production/sandbox]
        """
        return {"authorization_url": self.__authorization_url,
                "stk_initiate_url": self.__stk_initiate_url}

    def initiate_transaction(self, json_data):
        """
        Accepts json data from the user, parses it and then initializes a MPESA EXPRESS transaction
        :param json_data: This is the json data that carries the initialization details
        :return: returns an stk initiate response
        """
        requirements = ["amount", "phone_number", "callback_url", "account_reference", "transaction_desc",
                        "transaction_type", "short_code", "pass_key"]

        for item in requirements:
            if item not in json_data:
                return {"error": f"missing {item}"}
            elif not json_data[item]:
                return {"error": f"invalid {item}"}

        amount = int(json_data["amount"])
        phone_number = json_data["phone_number"]
        party_b = str(json_data["party_b"])
        callback_url = json_data["callback_url"]
        account_reference = json_data["account_reference"]
        transaction_desc = json_data["transaction_desc"]
        transaction_type = json_data["transaction_type"]
        short_code = str(json_data["short_code"])
        pass_key = json_data["pass_key"]

        stk_response = self._stk_initiate(amount=amount, phone_number=phone_number, callback_url=callback_url, party_b=party_b,
                                          account_reference=account_reference, transaction_desc=transaction_desc,
                                          transaction_type=transaction_type, short_code=short_code, pass_key=pass_key)

        return stk_response


class MpesaExpressCredentials(models.Model):
    callback_url = models.URLField(max_length=200)
    account_reference = models.CharField(max_length=200)
    transaction_desc = models.TextField()
    transaction_type = models.CharField(max_length=200)
    short_code = models.CharField(max_length=50)
    pass_key = models.TextField()
    consumer_key = models.TextField()
    consumer_secret = models.TextField()
    party_b = models.CharField(max_length=50)
    custom_id = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

class Payment(models.Model):
    amount = models.IntegerField()
    receipt_number = models.CharField(max_length=50)
    transaction_date = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)