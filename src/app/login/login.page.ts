import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, NavController } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  usuario: string = '';
  contrasena: string = '';
  
  usuarioError: string = '';
  contrasenaError: string = '';

  constructor(
    private userService: UserService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  validarUsuario(): boolean {
    this.usuarioError = '';
    
    if (!this.usuario || this.usuario.trim().length === 0) {
      this.usuarioError = 'El usuario es obligatorio';
      return false;
    }
    
    if (this.usuario.length < 3) {
      this.usuarioError = 'Mínimo 3 caracteres';
      return false;
    }
    
    if (this.usuario.length > 8) {
      this.usuarioError = 'Máximo 8 caracteres';
      return false;
    }
    
    // Validar que sea alfanumérico
    if (!/^[a-zA-Z0-9]+$/.test(this.usuario)) {
      this.usuarioError = 'Solo caracteres alfanuméricos';
      return false;
    }
    
    return true;
  }

  validarContrasena(): boolean {
    this.contrasenaError = '';
    
    if (!this.contrasena || this.contrasena.trim().length === 0) {
      this.contrasenaError = 'La contraseña es obligatoria';
      return false;
    }
    
    if (this.contrasena.length !== 4) {
      this.contrasenaError = 'Debe tener exactamente 4 dígitos';
      return false;
    }
    
    // Validar que sean solo números
    if (!/^\d{4}$/.test(this.contrasena)) {
      this.contrasenaError = 'Solo números (0-9)';
      return false;
    }
    
    return true;
  }

  ingresar() {
    if (this.validarUsuario() && this.validarContrasena()) {
      // Guardar datos del usuario
      this.userService.setUserData({
        usuario: this.usuario
      });
      
      // Navegar a Home
      this.navCtrl.navigateRoot('/home');
    }
  }
}

