from django.db import models
from solo.models import SingletonModel


class AboutUs(models.Model):
    title_one = models.CharField(max_length=500)
    content_one = models.TextField()
    title_two = models.CharField(max_length=500)
    content_two = models.TextField()

    class Meta:
        verbose_name_plural = "About Us"


class Menu(models.Model):
    FOOD_TYPE_CHOICES = (
        ('D', 'Dinner'),
        ('B', 'bar_menu'),
        ('W', 'Wines'),
    )
    type = models.CharField(max_length=2, choices=FOOD_TYPE_CHOICES)
    name = models.CharField(max_length=300)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "Menu"


class Pic(models.Model):
    picture = models.ImageField(upload_to='images/%Y/%m/%d')

    class Meta:
        verbose_name_plural = "Pictures"


class Contact(models.Model):
    address = models.CharField(max_length=300)
    number = models.CharField(max_length=20)
    email = models.EmailField()
    facebook = models.CharField(max_length=100)
    instagram = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Contact"
