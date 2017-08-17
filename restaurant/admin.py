from django.contrib import admin
from .models import AboutUs, Menu, Pic, Contact


@admin.register(AboutUs)
class AboutUAdmin(admin.ModelAdmin):
    list_display = ['title_one', 'content_one', 'title_two', 'content_two']


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['type', 'name', 'description']


@admin.register(Pic)
class PicAdmin(admin.ModelAdmin):
    list_display = ['picture', ]


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['address', 'number', 'email', 'facebook', 'instagram']