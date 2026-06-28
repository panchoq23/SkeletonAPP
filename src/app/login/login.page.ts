import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel,
  IonSelect, IonSelectOption, NavController, AlertController
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
    IonSelect, IonSelectOption, CommonModule, FormsModule
  ]
})
export class LoginPage implements OnInit {
  private readonly userService      = inject(UserService);
  private readonly navCtrl          = inject(NavController);
  private readonly storageService   = inject(StorageService);
  private readonly dbTaskService    = inject(DBTaskService);
  private readonly alertController  = inject(AlertController);

  usuario:    string = "";
  contrasena: string = "";

  // Campos adicionales para registro
  nombre:   string = "";
  correo:   string = "";
  carrera:  string = "";
  sede:     string = "";
  sedes: string[] = ["San Joaquín", "Maipú", "Antonio Varas", "Plaza Vespucio", "Puente Alto", "Viña del Mar", "Valparaíso", "Concepción"];

  usuarioError:    string = "";
  contrasenaError: string = "";
  isRegistering:   boolean = false;

  async ngOnInit() {
    const lastUser = await this.storageService.get("last_user");
    if (lastUser) {
      this.usuario = lastUser;
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
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
    return true;
  }

  validarContrasena(): boolean {
    this.contrasenaError = "";
    if (!this.contrasena || this.contrasena.length !== 4) {
      this.contrasenaError = "Debe tener 4 dígitos";
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
      this.userService.setUserData(user);
      this.navCtrl.navigateRoot("/home");
    } else {
      this.usuarioError = "Credenciales incorrectas";
    }
  }

  async registrar() {
    if (!this.validarUsuario() || !this.validarContrasena()) return;
    if (!this.sede) {
      this.usuarioError = "Debe seleccionar una sede";
      return;
    }

    const existe = await this.dbTaskService.userExists(this.usuario);
    if (existe) {
      const alert = await this.alertController.create({
        header: "Usuario existente",
        message: "Use otro nombre de usuario.",
        buttons: ["OK"]
      });
      await alert.present();
      return;
    }

    const newUser = {
      usuario: this.usuario,
      password: this.contrasena,
      nombre: this.nombre,
      correo: this.correo,
      carrera: this.carrera,
      sede: this.sede,
      rol: "Alumno"
    };

    await this.dbTaskService.registerUser(newUser);
    await this.dbTaskService.registerSession(this.usuario, this.contrasena);
    this.userService.setUserData(newUser);
    this.navCtrl.navigateRoot("/home");
  }
}
