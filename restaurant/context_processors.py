from .models import Pic


def pic(request):
    return {'pics': Pic.objects.all()}
