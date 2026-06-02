import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, AlertController } from '@ionic/angular/standalone';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../services/user.service';

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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule
  ],
})
export class HomePage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertController = inject(AlertController);

  @ViewChild('nombreInput') nombreInput!: ElementRef;
  @ViewChild('apellidoInput') apellidoInput!: ElementRef;

  usuario: string = '';
  nombre: string = '';
  apellido: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: Date | null = null;

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.usuario;
      this.nombre = userData.nombre || '';
      this.apellido = userData.apellido || '';
      this.nivelEducacion = userData.nivelEducacion || '';
      
      // Convertir string a Date si es necesario
      if (userData.fechaNacimiento) {
        if (typeof userData.fechaNacimiento === 'string') {
          this.fechaNacimiento = new Date(userData.fechaNacimiento);
        } else {
          this.fechaNacimiento = userData.fechaNacimiento as Date;
        }
      }
    }
  }

  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = null;

    // Aplicar animación shake a los inputs de nombre y apellido
    this.aplicarAnimacionShake();
  }

  aplicarAnimacionShake() {
    // Agregar clase de animación al input de nombre
    const nombreEl = this.nombreInput?.nativeElement;
    if (nombreEl) {
      nombreEl.classList.add('shake-animation');
      setTimeout(() => {
        nombreEl.classList.remove('shake-animation');
      }, 1000);
    }

    // Agregar clase de animación al input de apellido
    const apellidoEl = this.apellidoInput?.nativeElement;
    if (apellidoEl) {
      apellidoEl.classList.add('shake-animation');
      setTimeout(() => {
        apellidoEl.classList.remove('shake-animation');
      }, 1000);
    }
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

    // Formatear fecha
    let fechaFormato = '';
    if (this.fechaNacimiento) {
      const fecha = new Date(this.fechaNacimiento);
      fechaFormato = fecha.toLocaleDateString('es-ES');
    }

    // Guardar datos en el servicio
    this.userService.setUserData({
      usuario: this.usuario,
      nombre: this.nombre,
      apellido: this.apellido,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: fechaFormato
    });

    // Mostrar alerta con la información
    let mensaje = `<strong>Información del Usuario:</strong><br>`;
    mensaje += `<strong>Usuario:</strong> ${this.usuario}<br>`;
    mensaje += `<strong>Nombre:</strong> ${this.nombre}<br>`;
    mensaje += `<strong>Apellido:</strong> ${this.apellido}`;
    
    if (this.nivelEducacion) {
      mensaje += `<br><strong>Nivel de Educación:</strong> ${this.nivelEducacion}`;
    }
    if (fechaFormato) {
      mensaje += `<br><strong>Fecha de Nacimiento:</strong> ${fechaFormato}`;
    }

    const alert = await this.alertController.create({
      header: 'Información Registrada',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
