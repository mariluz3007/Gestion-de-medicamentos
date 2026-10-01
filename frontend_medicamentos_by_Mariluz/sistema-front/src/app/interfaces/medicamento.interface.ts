export interface Medicamento {
  id: number;
  nombre: string;
  descripcion: string;
  laboratorio: string;
  precio: number;
  stock: number;
  fecha_vencimiento: string;
  requiere_receta: boolean;
  fecha_registro: string;
}