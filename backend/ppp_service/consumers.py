import json
import time
from channels.generic.websocket import WebsocketConsumer
from .active import get_client_status
import threading

class ClientStatusConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.service_name = None
        self.keep_running = True

    def disconnect(self, close_code):
        self.keep_running = False

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        self.service_name = text_data_json['service_name']

        # Start a new thread to poll the status periodically
        thread = threading.Thread(target=self.poll_client_status)
        thread.start()

    def poll_client_status(self):
        while self.keep_running:
            if self.service_name:
                status = get_client_status(self.service_name)

                # Send the status back to the WebSocket client
                self.send(text_data=json.dumps({
                    'status': status
                }))

            # Wait for 5 seconds before polling again (adjust as necessary)
            time.sleep(5)
