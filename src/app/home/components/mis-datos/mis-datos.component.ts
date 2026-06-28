import { Component, Input, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, AlertController } from "@ionic/angular/standalone";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { DBTaskService, User } from "../../../services/dbtask.service";

@Component({
  selector: "app-mis-datos",
  templateUrl: "./mis-datos.component.html",
  standalone: true,
  imports: [
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonSelect, IonSelectOption,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    CommonModule, FormsModule
  ]
})
export class MisDatosComponent implements OnInit {
  private readonly dbService = inject(DBTaskService);
  private readonly alertController = inject(AlertController);

  @Input() usuario: string = "";

  nombre: string = "";
  apellido: string = "";
  nivelEducacion: string = "";
  fechaNacimiento: Date | null = null;

  async ngOnInit() {
    const data = await this.dbService.getUser(this.usuario);
    if (data) {
      this.nombre = data.nombre || "";
      this.apellido = data.apellido || "";
      this.nivelEducacion = data.nivelEducacion || "";
      if (data.fechaNacimiento) {
        this.fechaNacimiento = new Date(data.fechaNacimiento);
      }
    }
  }

  limpiar() {
    this.nombre = "";
    this.apellido = "";
    this.nivelEducacion = "";
    this.fechaNacimiento = null;
  }

  async guardar() {
    const userData: User = {
      usuario: this.usuario,
      nombre: this.nombre,
      apellido: this.apellido,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: this.fechaNacimiento ? this.fechaNacimiento.toISOString() : null
    };

    await this.dbService.saveUserDetails(userData);

    const alert = await this.alertController.create({
      header: "Éxito",
      message: "Datos guardados correctamente",
      buttons: ["OK"]
    });
    await alert.present();
  }
}
