import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonCheckbox, IonList, IonListHeader, IonItem, AlertController } from '@ionic/angular/standalone';
import { DBTaskService } from '../../../services/dbtask.service';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  standalone: true,
  imports: [
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonCheckbox, IonList, IonListHeader, IonItem,
    CommonModule, FormsModule
  ]
})
export class CertificacionesComponent implements OnInit {
  private readonly dbService = inject(DBTaskService);
  private readonly alertController = inject(AlertController);

  @Input() usuario: string = '';

  nombreCertificado: string = '';
  fechaObtencion: string = '';
  vence: boolean = false;
  fechaVencimiento: string = '';

  certificaciones: any[] = [];

  async ngOnInit() {
    await this.cargarCertificaciones();
  }

  async cargarCertificaciones() {
    this.certificaciones = await this.dbService.getCertifications(this.usuario);
  }

  async guardar() {
    if (!this.nombreCertificado || !this.fechaObtencion) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor complete los campos obligatorios',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    await this.dbService.saveCertification({
      usuario: this.usuario,
      nombreCertificado: this.nombreCertificado,
      fechaObtencion: this.fechaObtencion,
      vence: this.vence,
      fechaVencimiento: this.vence ? this.fechaVencimiento : null
    });

    await this.cargarCertificaciones();
    this.limpiar();
  }

  limpiar() {
    this.nombreCertificado = '';
    this.fechaObtencion = '';
    this.vence = false;
    this.fechaVencimiento = '';
  }
}
