from django.conf.urls import url
from django.conf import settings
from django.views.static import serve
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^stories_index/$', views.stories_index, name='stories_index'),
    url(r'^wines_index/$', views.wines_index, name='wines_index'),
    url(r'^bar_menu_index/$', views.bar_menu_index, name='bar_menu_index'),
    url(r'^dinner_index/$', views.dinner_index, name='dinner_index'),
    url(r'^menu_index/$', views.menu_index, name='menu_index'),
    url(r'^reservation_index/$', views.reservation_index, name='reservation_index'),
    url(r'^contact_index/$', views.contact_index, name='contact_index'),
    url(r'^about_index/$', views.about_index, name='about_index'),
]

if settings.DEBUG:
    urlpatterns += [url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}, name="static")]