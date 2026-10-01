from .serializers import MedicamentoSerializer, MedicamentoSerializerReg, MedicamentoSerializerUpdate, MedicamentoSerializerDelete
from rest_framework.decorators import api_view
from .models import Medicamento
from medicamentos.response import Result,TryCatch,ListError
from rest_framework.status import HTTP_200_OK,HTTP_201_CREATED
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q
from django.core.paginator import Paginator
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def lista_medicamentos(request):
    def action_to_execute():
        medicamentos = Medicamento.objects.all()
        serializer = MedicamentoSerializer(medicamentos, many=True)
        return Response(serializer.data)
        return Result.Exitosa('Medicamentos obtenidos exitosamente', serializer.data, HTTP_200_OK)
    return TryCatch(action_to_execute)

@swagger_auto_schema(
    method='post',
    operation_description='Añade una nuevo medicamento.',
    request_body=MedicamentoSerializerReg,
    responses={200: 'Exitoso', 400: 'Error'}
)

@api_view(['POST'])
def crear_medicamento(request):
    nombre = request.data.get('nombre')
    descripcion = request.data.get('descripcion')
    laboratorio = request.data.get('laboratorio')
    precio = request.data.get('precio')
    stock = request.data.get('stock')
    fecha_vencimiento = request.data.get('fecha_vencimiento')   
    requiere_receta = request.data.get('requiere_receta', False)
    
    if not nombre or not descripcion or not laboratorio or precio is None or stock is None or not fecha_vencimiento:
        return Response({'error': 'Faltan campos obligatorios'}, status=400)
    
    serialData = MedicamentoSerializerReg(data=request.data)

    if serialData.is_valid():
        serialData.save()
    else:
        return Response(serialData.errors, status=400)

    return Response({'message': 'Medicamento creado exitosamente'}, status=201)

    ListError.Mensaje.clear()
    if not nombre:
        ListError.Mensaje.append("Complete la casilla nombre!")
    if not descripcion:
        ListError.Mensaje.append("Complete la casilla descripcion !")
    if not laboratorio:
        ListError.Mensaje.append("Complete la casilla laboratorio!")
    if not precio and precio != 0:
        ListError.Mensaje.append("Complete la casilla precio!")
    if not stock and stock != 0:
        ListError.Mensaje.append("Complete la casilla stock!")
    if not fecha_vencimiento:
        ListError.Mensaje.append("Complete la casilla fecha_vencimiento!")
    if not requiere_receta:
        ListError.Mensaje.append("Complete la casilla requiere_receta!")
    if not fecha_registro:
        ListError.Mensaje.append("Complete la casilla fecha_registro!")

    if ListError.Mensaje:
        return Result.Error(ListError.Mensaje)   

        serialData=MedicamentoSerializerReg(data=request.data)

    if serialData.is_valid():
        serialData.save()
    else:
        return Result.Error("Complete los campos vacíos")

    return Result.Exitosa("Se registro correctamente", {},HTTP_201_CREATED)

@api_view(['PUT'])
def actualizar_medicamento(request):
    pk = request.data.get('id')

    print(pk)
    nombre = request.data.get('nombre')
    descripcion = request.data.get('descripcion')
    laboratorio = request.data.get('laboratorio')
    precio = request.data.get('precio')
    stock = request.data.get('stock')
    fecha_vencimiento = request.data.get('fecha_vencimiento')
    requiere_receta = request.data.get('requiere_receta', False)

    if not nombre or not descripcion or not laboratorio or precio is None or stock is None or not fecha_vencimiento:
        return Response({'error': 'Faltan campos obligatorios'}, status=400)
    
    try:
        medicamento_instance = Medicamento.objects.get(id=pk)
    except Medicamento.DoesNotExist:
        return Response({'error': 'Medicamento no encontrado'}, status=404)
    
    serialData = MedicamentoSerializerUpdate(medicamento_instance, data=request.data)

    if serialData.is_valid():
        serialData.save()
    else:
        return Response(serialData.errors, status=400)
    
    return Response({'message': 'Medicamento actualizado exitosamente'}, status=200)

@api_view(['DELETE'])
def eliminar_medicamento(request, id):
    try:
        medicamento_instance = Medicamento.objects.get(id=id)
    except Medicamento.DoesNotExist:
        return Response({'error': 'Medicamento no encontrado'}, status=404)

    medicamento_instance.delete()
    return Response({'message': 'Medicamento eliminado exitosamente'}, status=200)

page_paramView = openapi.Parameter(
    'page',
    openapi.IN_QUERY,
    description="Page",
    type=openapi.TYPE_INTEGER,
)

filter_paramView = openapi.Parameter(
    'filter',
    openapi.IN_QUERY,
    description="Filter",
    type=openapi.TYPE_STRING,
)

@swagger_auto_schema(
    method='get',
    operation_description="Buscar",
    manual_parameters=[page_paramView,filter_paramView],
    responses={200: 'Exitoso', 400: 'Error'})

@api_view(['GET'])
def Paginators(request):
    page = request.GET.get('page, 1')
    pagesize = 1
    filter= request.GET.get('filter')

    showPages = int(pagesize)

    if filter:
        query = (
            Q(nombre__icontains=filter) | 
            Q(descripcion__icontains=filter) | 
            Q(laboratorio__icontains=filter)
)

        cont = Medicamento.objects.filter(query)

    else:
        cont =  Medicamento.objects.all().order_by('-id')

    paginator = Paginator(cont, showPages)
    total_pages = paginator.num_pages

    try:
        page = int(page)
    except (ValueError, TypeError):
        page = 1

    if page > total_pages or page < 1:
        return Result.ErrorResponsePaginator("No se encuentra esta página",total_pages,page)

    if page == total_pages and paginator.num_pages % showPages != 0:
        page_obj = paginator.page(total_pages)
    else:
        page_obj = paginator.page(page)

    if page == total_pages:
        button_previous = True
        button_next = False
    elif page <= 1:
        button_previous = False
        button_next = True
    elif page < total_pages:
        button_previous = True
        button_next = True

    serialdata = MedicamentoSerializer(page_obj, many=True)

    return Result.ResponsePaginator('',serialdata.data, total_pages, page, button_previous, button_next)