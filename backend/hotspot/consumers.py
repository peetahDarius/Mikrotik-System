import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import time
#from .models import UnifiCredentials
import requests
import asyncio
from asgiref.sync import sync_to_async
import httpx
from unifi import controller


class PaymentStatusConsumer(AsyncWebsocketConsumer):
    timeout = 300  # 5 minutes in seconds

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"payment_status_{self.room_name}"

        # Join the room group specific to this user
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Start the timeout timer
        self.timeout_task = asyncio.create_task(self.check_timeout())

    async def disconnect(self, close_code):
        # Cancel the timeout task
        if hasattr(self, 'timeout_task'):
            self.timeout_task.cancel()
        
        # Leave the room group when the user disconnects
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def payment_status_update(self, event):
        message = event['message']
        # print(f"Sending message to WebSocket: {message}")
        # Send message back to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
        
        # Reset the timeout timer on activity
        if hasattr(self, 'timeout_task'):
            self.timeout_task.cancel()
        self.timeout_task = asyncio.create_task(self.check_timeout())

    async def check_timeout(self):
        try:
            # Wait for the timeout period
            await asyncio.sleep(self.timeout)
            # Close the connection if the timeout expires
            await self.close()
        except asyncio.CancelledError:
            # Timeout task was cancelled, no action needed
            pass


class ActiveDevicesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.stop_event = asyncio.Event()
        
        # Start the loop to periodically fetch active devices
        self.background_task = asyncio.create_task(self.fetch_active_devices())

    async def fetch_active_devices(self):

        from .models import UnifiCredentials

        while not self.stop_event.is_set():
            try:
                # Use sync_to_async to perform synchronous operations in async context
                credentials = await sync_to_async(UnifiCredentials.objects.get)(custom_id=1)
                host = credentials.host
                username = credentials.username
                password = credentials.password
                port = credentials.port
                
                uconn = controller.Controller(host=host, port=port)
                
                uconn.username = username
                uconn.password = password
                
                devices_data = uconn.get_clients()
                
                await self.send(text_data=json.dumps(devices_data))
            
            except Exception as e:
                await self.send(text_data=json.dumps({"error": f"An error occurred: {e}"}))
            
            await asyncio.sleep(3)

    async def disconnect(self, close_code):
        self.stop_event.set()
        if self.background_task:
            await self.background_task
