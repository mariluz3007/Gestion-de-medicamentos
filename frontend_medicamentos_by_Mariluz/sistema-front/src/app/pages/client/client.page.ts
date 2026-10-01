import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { Cliente } from 'src/app/interfaces/clientInterface';
import { ApiCliente } from 'src/app/services/api-cliente';
import { Helper } from 'src/app/services/helper';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  standalone: false,
})
export class ClientPage implements OnInit {
  @ViewChild('modalCliente', { static: false }) modalCliente!: IonModal;

  titleModal: string = 'Registrar clientes';
  buttonName: string = 'Registrar';
  iconName: string = 'save-outline';
  visibleButton: boolean = true;

  IdCliente: number = 0;
  op: string = '';

  cliente = {
    id: 0,
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    direccion: '',
    ingresos: 0,
    rnc: '',
  };

  ListClientes: Array<Cliente> = [];
  ListClienteView: Array<Cliente> = [];
  currentpage: number = 1;
  maximo: number = 2;
  maxPages: number[] = [];
  previous: boolean = false;
  next: boolean = false;

  msj: Array<unknown> = [];
  filter: string = '';

  constructor(
    private ApiCliente: ApiCliente,
    private helper: Helper,
    private alertController: AlertController,
  ) {}

  async ngOnInit() {
    await this.GetClientes(1);
  }

  async GetClientes(page: number) {
    const l = await this.helper.showLoading('Cargando...');
    l.present();
    try {
      const result = await this.ApiCliente.getClientesPaginados(page);

      if (!result.success) {
        console.log(result.Mensaje);

        return;
      }

      this.recorrerMaximosPages(result.maxPages);
      this.ListClientes = result.datos;
      this.currentpage = result.currentpage;
      this.previous = result.previous;
      this.next = result.next;
    } catch (error) {
      console.log(error);
    } finally {
      l.dismiss();
    }
  }

  resetSearch() {
    this.filter = '';
    this.GetClientes(1);
  }

  onValueChangeSearch(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
  }

  async SearchClientes() {
    const l = await this.helper.showLoading('Cargando...');
    l.present();
    try {
      const result = await this.ApiCliente.getClientesPaginados(1, this.filter);

      if (!result.success) {
        console.log(result.Mensaje);

        return;
      }

      this.recorrerMaximosPages(result.maxPages);
      this.ListClientes = result.datos;

      this.currentpage = result.currentpage;
      this.previous = result.previous;
      this.next = result.next;
    } catch (error) {
      console.log(error);
    } finally {
      l.dismiss();
    }
  }

  async GetClienteView(Id: number = 0) {
    const l = await this.helper.showLoading('Cargando...');
    l.present();
    try {
      const result = await this.ApiCliente.getClientesView(Id);

      if (!result.success) {
        console.log(result.Mensaje);

        return;
      }

      this.ListClienteView = result.datos;
    } catch (error) {
      console.log(error);
    } finally {
      l.dismiss();
    }
  }

  recorrerMaximosPages(maximo: number) {
    this.maxPages = [];

    for (let i = 1; i <= maximo; i++) {
      this.maxPages.push(i);
    }
  }

  buttonNext() {
    this.currentpage += 1;
    this.GetClientes(this.currentpage);
  }

  buttonPrevious() {
    this.currentpage -= 1;
    this.GetClientes(this.currentpage);
  }

  openModalCliente() {
    this.modalCliente.present();
  }

  closeModalCliente() {
    this.modalCliente.dismiss();
    this.GetClientes(1);
  }

  async OptionClient(option: string, IdCliente: number) {
    this.LimpiarControles();
    this.op = option;
    this.IdCliente = IdCliente;

    if (option === 'i') {
      this.titleModal = 'Registrar clientes';
      this.buttonName = 'Registrar';
      this.iconName = 'save-outline';
      this.visibleButton = true;

      this.openModalCliente();
    }

    if (option === 'u') {
      this.titleModal = 'Editar cliente';
      this.buttonName = 'Editar';
      this.iconName = 'create-outline';
      this.visibleButton = true;

      await this.GetClienteView(this.IdCliente);
      this.cliente.id = this.IdCliente;
      this.cliente.nombre = this.ListClienteView[0].nombre;
      this.cliente.apellido = this.ListClienteView[0].apellido;
      this.cliente.cedula = this.ListClienteView[0].cedula;
      this.cliente.telefono = this.ListClienteView[0].telefono;
      this.cliente.direccion = this.ListClienteView[0].direccion;
      this.cliente.ingresos = this.ListClienteView[0].ingresos;
      this.cliente.rnc = this.ListClienteView[0].rnc;


      this.openModalCliente();
    }

    if (option === 'v') {
      this.titleModal = 'Datos del cliente';
      this.visibleButton = false;

      await this.GetClienteView(this.IdCliente);
      this.cliente.id = this.IdCliente;
      this.cliente.nombre = this.ListClienteView[0].nombre;
      this.cliente.apellido = this.ListClienteView[0].apellido;
      this.cliente.cedula = this.ListClienteView[0].cedula;
      this.cliente.telefono = this.ListClienteView[0].telefono;
      this.cliente.direccion = this.ListClienteView[0].direccion;
      this.cliente.ingresos = this.ListClienteView[0].ingresos;
      this.cliente.rnc = this.ListClienteView[0].rnc;
      this.openModalCliente();
    }

    if (option === 'd') {
      this.FunctionCliente();
    }
  }

  LimpiarControles() {
    this.cliente = {
      id: 0,
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      direccion: '',
      ingresos: 0,
      rnc: '',
    };
  }

  async validationForm() {
    if (!this.cliente.nombre) {
      return await this.helper.showToast(
        'Complete la casilla nombre!',
        'danger',
        'top',
      );
    }
    if (!this.cliente.apellido) {
      return await this.helper.showToast(
        'Complete la casilla apellido!',
        'danger',
        'top',
      );
    }

    if (!this.cliente.cedula) {
      return await this.helper.showToast(
        'Complete la casilla cedula!',
        'danger',
        'top',
      );
    }

    if (!this.cliente.telefono) {
      return await this.helper.showToast(
        'Complete la casilla telefono!',
        'danger',
        'top',
      );
    }

    if (!this.cliente.direccion) {
      return await this.helper.showToast(
        'Complete la casilla direccion!',
        'danger',
        'top',
      );
    }

    if (!this.cliente.rnc) {
      return await this.helper.showToast(
        'Complete la casilla RNC!',
        'danger',
        'top',
      );
    }
  }

  async FunctionCliente() {
    if (this.op === 'i') {
      this.validationForm();

      const l = await this.helper.showLoading('Cargando...');
      l.present();

      try {
        const result = await this.ApiCliente.addCliente(this.cliente);

        if (!result?.success) {
          console.log(result?.Mensaje);
          this.msj.push(result?.Mensaje);

          return;
        }
        this.LimpiarControles();
        this.closeModalCliente();
        this.GetClientes(1);

        this.helper.showToast('Se registro correctamente', 'success', 'top');
      } catch (error) {
        console.log(error);
      } finally {
        l.dismiss();
      }
    } else if (this.op === 'u') {
      this.validationForm();

      const l = await this.helper.showLoading('Cargando...');
      l.present();

      try {
        const result = await this.ApiCliente.updateCliente(this.cliente);

        if (!result?.success) {
          console.log(result?.Mensaje);
          this.msj.push(result?.Mensaje);

          await this.helper.showToast(
            this.msj[0] as string,
            'danger',
            'bottom',
          );
          return;
        }
        this.LimpiarControles();
        this.closeModalCliente();
        this.GetClientes(1);

        this.helper.showToast('Se modifico correctamente', 'success', 'top');
      } catch (error) {
        console.log(error);
      } finally {
        l.dismiss();
      }
    } else if (this.op === 'd') {
      const l = await this.helper.showLoading('Cargando...');
      l.present();
      this.cliente.id = this.IdCliente;
      try {
        const result = await this.ApiCliente.deleteCliente(this.IdCliente);

        if (!result?.success) {
          console.log(result?.Mensaje);
          this.msj.push(result?.Mensaje);

          this.msj.forEach((x) => {
            this.helper.showToast(x as string, 'danger', 'top');
          });

          return;
        }
        this.LimpiarControles();
        this.closeModalCliente();
        this.GetClientes(1);

        this.helper.showToast('Se elimino correctamente', 'success', 'top');
      } catch (error) {
        console.log(error);
      } finally {
        l.dismiss();
      }
    }
  }

  async presentDeleteConfirm(IdCliente: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Seguro que deseas eliminar este registro?',

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.OptionClient('d', IdCliente);
          },
        },
      ],
    });

    await alert.present();
  }
}