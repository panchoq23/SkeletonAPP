import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, AlertController } from '@ionic/angular/standalone';
import { UserService, UserData } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule
  ],
})
export class HomePage implements OnInit {
  usuario: string = '';
  nombre: string = '';
  apellido: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: string = '';

  constructor(
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.usuario;
      this.nombre = userData.nombre || '';
      this.apellido = userData.apellido || '';
      this.nivelEducacion = userData.nivelEducacion || '';
      this.fechaNacimiento = userData.fechaNacimiento || '';
    }
  }

  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = '';
  }

  async mostrar() {
    // Validar que al menos nombre y apellido estén llenos
    if (!this.nombre.trim() || !this.apellido.trim()) {
      const alert = await this.alertController.create({
        header: 'Información incompleta',
        message: 'Por favor, ingrese al menos el nombre y apellido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Guardar datos en el servicio
    this.userService.setUserData({
      usuario: this.usuario,
      nombre: this.nombre,
      apellido: this.apellido,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: this.fechaNacimiento
    });

    // Mostrar alerta con la información
    let mensaje = `<strong>Información del Usuario:</strong><br>`;
    mensaje += `<strong>Usuario:</strong> ${this.usuario}<br>`;
    mensaje += `<strong>Nombre:</strong> ${this.nombre}<br>`;
    mensaje += `<strong>Apellido:</strong> ${this.apellido}`;
    
    if (this.nivelEducacion) {
      mensaje += `<br><strong>Nivel de Educación:</strong> ${this.nivelEducacion}`;
    }
    if (this.fechaNacimiento) {
      mensaje += `<br><strong>Fecha de Nacimiento:</strong> ${this.fechaNacimiento}`;
    }

    const alert = await this.alertController.create({
      header: 'Información Registrada',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}

