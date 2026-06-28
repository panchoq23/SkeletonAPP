import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel,
  IonSelect, IonSelectOption, IonItem, IonIcon, NavController, AlertController
} from "@ionic/angular/standalone";
import { DBTaskService } from "../services/dbtask.service";
import { UserService } from "../services/user.service";
import { StorageService } from "../services/storage.service";
import { addIcons } from "ionicons";
import { personOutline, lockClosedOutline, schoolOutline, businessOutline, idCardOutline } from "ionicons/icons";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel,
    IonSelect, IonSelectOption, IonItem, IonIcon, CommonModule, FormsModule
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
  nombre:     string = "";
  carrera:    string = "";
  sede:       string = "";
  sedes: string[] = ["San Joaquín", "Maipú", "Antonio Varas", "Plaza Vespucio", "Puente Alto", "Viña del Mar", "Valparaíso", "Concepción"];

  usuarioError:    string = "";
  isRegistering:   boolean = false;

  constructor() {
    addIcons({ personOutline, lockClosedOutline, schoolOutline, businessOutline, idCardOutline });
  }

  async ngOnInit() {
    const lastUser = await this.storageService.get("last_user");
    if (lastUser) {
      this.usuario = lastUser;
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.usuarioError = "";
  }

  async ingresar() {
    if (!this.usuario || !this.contrasena) {
      this.usuarioError = "Completa todos los campos";
      return;
    }

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
    if (!this.usuario || !this.contrasena || !this.sede) {
      this.usuarioError = "Completa todos los campos obligatorios";
      return;
    }

    const existe = await this.dbTaskService.userExists(this.usuario);
    if (existe) {
      this.usuarioError = "El usuario ya existe";
      return;
    }

    const newUser = {
      usuario: this.usuario,
      password: this.contrasena,
      nombre: this.nombre,
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
