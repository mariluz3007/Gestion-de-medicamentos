import { Component, OnInit } from '@angular/core';
import { MedicamentoService } from '../services/medicamento.service';
import { Medicamento } from '../interfaces/medicamento.interface';

@Component({
  standalone: false,
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
})
export class MedicamentosPage implements OnInit {

  medicamentos: Medicamento[] = [];
  medicamentosOriginales: Medicamento[] = [];

    // =========================
  // PAGINACIÓN
  // =========================

  paginaActual = 1;
  itemsPorPagina = 5;
  totalPaginas = 1;

  mostrarFormulario = false;
  modoEdicion = false;

  medicamentoSeleccionado: Medicamento | null = null;

  terminoBusqueda = '';

  formulario: any = {
    nombre: '',
    descripcion: '',
    laboratorio: '',
    precio: 0,
    stock: 0,
    fecha_vencimiento: '',
    requiere_receta: false
  };

  constructor(
    private medicamentoService: MedicamentoService
  ) {}

  ngOnInit() {
    this.obtenerMedicamentos();
  }

  // =========================
  // GET
  // =========================

  obtenerMedicamentos() {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (data: Medicamento[]) => {

        this.medicamentosOriginales = [...data];
        this.medicamentos = [...data];

        this.paginaActual = 1;

        this.actualizarPaginacion();

        console.log('Medicamentos:', data);
      },

      error: (error: any) => {
        console.error('Error al obtener medicamentos:', error);
      }
    });
  }
  // =========================
  // NUEVO
  // =========================

  nuevoMedicamento() {

    this.modoEdicion = false;

    this.medicamentoSeleccionado = null;

    this.formulario = {
      nombre: '',
      descripcion: '',
      laboratorio: '',
      precio: 0,
      stock: 0,
      fecha_vencimiento: '',
      requiere_receta: false
    };

    this.mostrarFormulario = true;
  }

  // =========================
  // EDITAR
  // =========================

  editarMedicamento(medicamento?: Medicamento) {

    if (!medicamento) {
      alert('Selecciona un medicamento de la lista para editarlo.');
      return;
    }

    this.modoEdicion = true;
    this.medicamentoSeleccionado = medicamento;

    this.formulario = {
      id: medicamento.id,
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      laboratorio: medicamento.laboratorio,
      precio: medicamento.precio,
      stock: medicamento.stock,
      fecha_vencimiento: medicamento.fecha_vencimiento,
      requiere_receta: medicamento.requiere_receta
    };

    this.mostrarFormulario = true;
  }

  // =========================
  // GUARDAR
  // =========================

  guardarMedicamento() {

    if (!this.formulario.nombre) {
      alert('El nombre del medicamento es obligatorio.');
      return;
    }

    if (this.modoEdicion) {
      this.actualizarMedicamento();
    } else {
      this.crearMedicamento();
    }
  }

  // =========================
  // POST
  // =========================

  crearMedicamento() {

    console.log('Datos a crear:', this.formulario);

    this.medicamentoService.postMedicamento(this.formulario).subscribe({
      next: (data: Medicamento) => {

        console.log('Medicamento creado:', data);

        alert('Medicamento creado correctamente.');

        this.mostrarFormulario = false;

        this.obtenerMedicamentos();
      },

      error: (error: any) => {
        console.error('Error al crear:', error);

        alert('Error al crear el medicamento.');
      }
    });
  }

  // =========================
  // PUT
  // =========================

  actualizarMedicamento() {

    if (!this.formulario.id) {
      alert('No se encontró el ID del medicamento.');
      return;
    }

    console.log('Datos a actualizar:', this.formulario);

    this.medicamentoService.putMedicamento(
      this.formulario.id,
      this.formulario
    ).subscribe({

      next: (data: Medicamento) => {

        console.log('Medicamento actualizado:', data);

        alert('Medicamento actualizado correctamente.');

        this.mostrarFormulario = false;

        this.obtenerMedicamentos();
      },

      error: (error: any) => {

        console.error('Error al actualizar:', error);

        alert('Error al actualizar el medicamento.');
      }
    });
  }

  // =========================
  // DELETE
  // =========================

  eliminarMedicamento(medicamento?: Medicamento) {

    if (!medicamento) {
      alert('Selecciona un medicamento de la lista para eliminarlo.');
      return;
    }

    const confirmar = confirm(
      `¿Seguro que quieres eliminar "${medicamento.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.medicamentoService.deleteMedicamento(
      medicamento.id
    ).subscribe({

      next: () => {

        alert('Medicamento eliminado correctamente.');

        this.obtenerMedicamentos();
      },

      error: (error: any) => {

        console.error('Error al eliminar:', error);

        alert('Error al eliminar el medicamento.');
      }
    });
  }

  // =========================
  // BUSCAR
  // =========================

  buscarMedicamento() {

  const texto = this.terminoBusqueda
    .toLowerCase()
    .trim();

  if (!texto) {
    this.medicamentos = [...this.medicamentosOriginales];
  } else {
    this.medicamentos = this.medicamentosOriginales.filter(
      medicamento =>
        medicamento.nombre.toLowerCase().includes(texto) ||
        medicamento.laboratorio.toLowerCase().includes(texto)
    );
  }

  this.paginaActual = 1;
  this.actualizarPaginacion();
}

  // =========================
  // SELECCIONAR
  // =========================

// =========================
// PAGINACIÓN
// =========================

actualizarPaginacion() {
  this.totalPaginas = Math.ceil(
    this.medicamentosOriginales.length / this.itemsPorPagina
  );

  if (this.totalPaginas === 0) {
    this.totalPaginas = 1;
  }

  if (this.paginaActual > this.totalPaginas) {
    this.paginaActual = this.totalPaginas;
  }
}

obtenerMedicamentosPagina(): Medicamento[] {
  const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
  const fin = inicio + this.itemsPorPagina;

  return this.medicamentos.slice(inicio, fin);
}

paginaAnterior() {
  if (this.paginaActual > 1) {
    this.paginaActual--;
  }
}

paginaSiguiente() {
  if (this.paginaActual < this.totalPaginas) {
    this.paginaActual++;
  }
}

  seleccionarMedicamento(medicamento: Medicamento) {

    this.medicamentoSeleccionado = medicamento;

    console.log(
      'Medicamento seleccionado:',
      medicamento
    );
  }

  // =========================
  // CANCELAR
  // =========================

  cancelar() {

    this.mostrarFormulario = false;

    this.medicamentoSeleccionado = null;
  }

}