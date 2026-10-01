"""
URL configuration for gestion_medicamentos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from medicamentos.views import lista_medicamentos, crear_medicamento, actualizar_medicamento, eliminar_medicamento, Paginators

schema_view = get_schema_view(
    openapi.Info(
        title="Api project - Gestión de Medicamentos",
        default_version='v1',
        description="Descripción de mi API",
        terms_of_service="https://www.tus-terminos.com/",
        contact=openapi.Contact(email="contacto@tudominio.com"),
        license=openapi.License(name="Licencia XYZ"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('medicamentos/', lista_medicamentos, name='lista_medicamentos'),
    path('medicamentos/crear/', crear_medicamento, name='crear_medicamento'),
    path('medicamentos/actualizar/', actualizar_medicamento, name='actualizar_medicamento'),
    path('medicamentos/eliminar/<int:id>/', eliminar_medicamento, name='eliminar_medicamento'),
    path('medicamentos/paginacion/', Paginators, name='paginacion_medicamentos'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
]
