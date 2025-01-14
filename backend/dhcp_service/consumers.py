import json
import time
from channels.generic.websocket import WebsocketConsumer
from .active import get_client_status
import threading

class ClientStatusConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.service_address = None
        self.keep_running = True

    def disconnect(self, close_code):
        self.keep_running = False

    def receive(self, text_data):
        
        text_data_json = json.loads(text_data)
        service_name = text_data_json['service_name']

        from dhcp_service.models import DHCPService

        try:
            self.service_adddress = DHCPService.objects.get(name=service_name).ip_address
            # Start a new thread to poll the status periodically
            thread = threading.Thread(target=self.poll_client_status)
            thread.start()
            
        except DHCPService.DoesNotExist:
            self.send(text_data=json.dumps({
                "status": "offline"
            }))
        

    def poll_client_status(self):
        while self.keep_running:
            if self.service_adddress:
                status = get_client_status(self.service_adddress)

                # Send the status back to the WebSocket client
                self.send(text_data=json.dumps({
                    'status': status
                }))

            # Wait for 5 seconds before polling again (adjust as necessary)
            time.sleep(3)
