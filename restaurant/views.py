from django.shortcuts import render, redirect, render_to_response
from django.core.mail import send_mail
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .forms import EmailPostForm
from .models import AboutUs, Contact, Menu, Story


@csrf_exempt
def index(request):
    return render(request, "restaurant/home/main_index.html")


def stories_index(request):
    return render(request, "restaurant/stories/stories_index.html", {'stories': Story.objects.order_by("-pk")})


def wines_index(request):
    wines = Menu.objects.filter(type='W')
    return render(request, "restaurant/menu/wines/wines_index.html", {'wines': wines})


def dinner_index(request):
    dinners = Menu.objects.filter(type='D')
    return render(request, "restaurant/menu/dinner/dinner_index.html", {'dinners': dinners})


def bar_menu_index(request):
    bars = Menu.objects.filter(type='B')
    return render(request, "restaurant/menu/bar_menu/bar_menu_index.html", {'bars': bars})


def menu_index(request):
    return render(request, "restaurant/menu/menu_index.html")


def reservation_index(request):
    return render(request, "restaurant/reservation/reservation_index.html")


def contact_index(request):
    contacts = Contact.objects.all()
    if request.method == 'POST':
        form = EmailPostForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            send_mail(cd['name'], cd['message'] + "\n\n\n Name: " + cd['name'] + "\nFrom: " + cd['email'], cd['email'], ['radoslavgenov5@hotmail.com'] )
            messages.success(request, 'email successfully sent!')
    else:
        form = EmailPostForm()
    return render(request, 'restaurant/contact/contact_index.html', {'form': form, 'contacts': contacts[0]})


def about_index(request):
    about = AboutUs.objects.all()
    return render(request, "restaurant/about/about_index.html", {'about': about[0]})


def base_pics(request):
    return render_to_response('restaurant/base.html', context_instance=RequestContext(request))
