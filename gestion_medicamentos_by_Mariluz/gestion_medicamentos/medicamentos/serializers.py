from rest_framework import serializers
from .models import Medicamento
from datetime import date

class MedicamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicamento
        fields = 'id', 'nombre', 'descripcion', 'laboratorio', 'precio', 'stock', 'fecha_vencimiento', 'requiere_receta', 'fecha_registro' 

class MedicamentoSerializerReg(serializers.ModelSerializer):
    class Meta:
        model = Medicamento
        fields = 'id', 'nombre', 'descripcion', 'laboratorio', 'precio', 'stock', 'fecha_vencimiento', 'requiere_receta', 'fecha_registro' 

class MedicamentoSerializerUpdate(serializers.ModelSerializer):
    id = serializers.IntegerField()
    
    class Meta:
        model = Medicamento
        fields = 'id', 'nombre', 'descripcion', 'laboratorio', 'precio', 'stock', 'fecha_vencimiento', 'requiere_receta', 'fecha_registro' 

class MedicamentoSerializerDelete(serializers.ModelSerializer):
    id = serializers.IntegerField()
    
    class Meta:
        model = Medicamento
        fields = 'id'

class MedicamentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medicamento
        fields = '__all__'

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "El precio no puede ser negativo"
            )
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "El stock no puede ser negativo"
            )
        return value

    def validate_fecha_vencimiento(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                "El medicamento está vencido"
            )
        return value