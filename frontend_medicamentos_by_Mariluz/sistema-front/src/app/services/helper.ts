import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Helper {
  constructor(
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  async showLoading(msj: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({
      message: msj,
      backdropDismiss: false,
    });
    return loading;
  }

  async showToast(
    msj: string = '',
    color: string = '',
    position: string | any = '',
  ) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      position: position,
      color: color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}