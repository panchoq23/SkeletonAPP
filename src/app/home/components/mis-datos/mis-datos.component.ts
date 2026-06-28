import { Component, Input, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, 
  AlertController, IonItem 
} from "@ionic/angular/standalone";
import { DBTaskService, User } from "../../../services/dbtask.service";

@Component({
  selector: "app-mis-datos",
  templateUrl: "./mis-datos.component.html",
  standalone: true,
  imports: [
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, IonItem,
    CommonModule, FormsModule
  ]
})
export class MisDatosComponent implements OnInit {
  private readonly dbService = inject(DBTaskService);
  private readonly alertController = inject(AlertController);

  @Input() usuario: string = "";

  nombre:   string = "";
  apellido: string = "";
  carrera:  string = "";
  sede:     string = "";
  sedes: string[] = ["San Joaquín", "Maipú", "Antonio Varas", "Plaza Vespucio", "Puente Alto", "Viña del Mar", "Valparaíso", "Concepción"];
  
  nivelEducacion: string = "";
  fechaNacimiento: Date | null = null;

  async ngOnInit() {
    const data = await this.dbService.getUser(this.usuario);
    if (data) {
      this.nombre = data.nombre || "";
      this.apellido = data.apellido || "";
      this.carrera = data.carrera || "";
      this.sede = data.sede || "";
      this.nivelEducacion = data.nivelEducacion || "";
      if (data.fechaNacimiento) {
        this.fechaNacimiento = new Date(data.fechaNacimiento);
      }
    }
  }

  async guardar() {
    const userData: User = {
      usuario: this.usuario,
      nombre: this.nombre,
      apellido: this.apellido,
      carrera: this.carrera,
      sede: this.sede,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: this.fechaNacimiento ? this.fechaNacimiento.toISOString() : null
    };

    await this.dbService.saveUserDetails(userData);

    const alert = await this.alertController.create({
      header: "Éxito",
      message: "Perfil actualizado correctamente",
      buttons: ["OK"]
    });
    await alert.present();
  }
}
