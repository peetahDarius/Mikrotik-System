from django.db import models

class Router(models.Model):
    name = models.CharField(max_length=200)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
    ip = models.CharField(max_length=150)
    custom_id = models.IntegerField(default=1)
    cert_webfig = models.FileField(upload_to='certificates/', max_length=100, null=True, blank=True)
    cert_webfig_decrypt = models.FileField(upload_to='keys/', max_length=100, null=True, blank=True)
    
    
    def delete(self, *args, **kwargs):
        # Delete the associated files
        if self.cert_webfig:
            self.cert_webfig.delete(save=False)
        if self.cert_webfig_decrypt:
            self.cert_webfig_decrypt.delete(save=False)
        # Call the superclass delete method
        super().delete(*args, **kwargs)
        
    def __str__(self) -> str:
        return self.name