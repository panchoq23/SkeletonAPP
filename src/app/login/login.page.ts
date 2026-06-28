import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel,
  NavController, AlertController
} from "@ionic/angular/standalone";
import { DBTaskService } from "../services/dbtask.service";
import { UserService } from "../services/user.service";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel,
    CommonModule, FormsModule
  ]
})
export class LoginPage implements OnInit {
  private readonly userService      = inject(UserService);
  private readonly navCtrl          = inject(NavController);
  private readonly storageService   = inject(StorageService);
  private readonly dbTaskService    = inject(DBTaskService);
  private readonly alertController  = inject(AlertController);

  usuario:   string = "";
  contrasena: string = "";

  usuarioError:   string = "";
  contrasenaError: string = "";

  async ngOnInit() {
    const lastUser = await this.storageService.get("last_user");
    if (lastUser) {
      this.usuario = lastUser;
    }
  }

  validarUsuario(): boolean {
    this.usuarioError = "";

    if (!this.usuario || this.usuario.trim().length === 0) {
      this.usuarioError = "El usuario es obligatorio";
      return false;
    }
    if (this.usuario.length < 3) {
      this.usuarioError = "Mínimo 3 caracteres";
      return false;
    }
    if (this.usuario.length > 8) {
      this.usuarioError = "Máximo 8 caracteres";
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(this.usuario)) {
      this.usuarioError = "Solo caracteres alfanuméricos";
      return false;
    }
    return true;
  }

  validarContrasena(): boolean {
    this.contrasenaError = "";

    if (!this.contrasena || this.contrasena.trim().length === 0) {
      this.contrasenaError = "La contraseña es obligatoria";
      return false;
    }
    if (this.contrasena.length !== 4) {
      this.contrasenaError = "Debe tener exactamente 4 dígitos";
      return false;
    }
    if (!/^\d{4}$/.test(this.contrasena)) {
      this.contrasenaError = "Solo números (0-9)";
      return false;
    }
    return true;
  }

  async ingresar() {
    if (!this.validarUsuario() || !this.validarContrasena()) return;

    const user = await this.dbTaskService.validateUser(this.usuario, this.contrasena);
    if (user) {
      await this.dbTaskService.registerSession(this.usuario, this.contrasena);
      await this.storageService.set("last_user", this.usuario);
      this.userService.setUserData({ usuario: this.usuario });
      this.navCtrl.navigateRoot("/home");
    } else {
      this.usuarioError = "Usuario o contraseña incorrectos";
    }
  }

  async registrar() {
    if (!this.validarUsuario() || !this.validarContrasena()) return;

    const existe = await this.dbTaskService.userExists(this.usuario);
    if (existe) {
      const alert = await this.alertController.create({
        header: "Usuario existente",
        message: `El usuario "${this.usuario}" ya está registrado. ¿Desea iniciar sesión en su lugar?`,
        buttons: [
          { text: "Cancelar", role: "cancel" },
          { text: "Ingresar", handler: () => this.ingresar() }
        ]
      });
      await alert.present();
      return;
    }

    await this.dbTaskService.registerUser({
      usuario: this.usuario,
      password: this.contrasena
    });
    await this.dbTaskService.registerSession(this.usuario, this.contrasena);
    await this.storageService.set("last_user", this.usuario);
    this.userService.setUserData({ usuario: this.usuario });
    this.navCtrl.navigateRoot("/home");
  }
}
