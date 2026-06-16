import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonCheckbox, IonList, IonListHeader, IonItem, AlertController } from '@ionic/angular/standalone';
import { DBTaskService } from '../../../services/dbtask.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  standalone: true,
  imports: [
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonLabel, IonCheckbox, IonList, IonListHeader, IonItem,
    CommonModule, FormsModule
  ]
})
export class ExperienciaLaboralComponent implements OnInit {
  private readonly dbService = inject(DBTaskService);
  private readonly alertController = inject(AlertController);

  @Input() usuario: string = '';

  empresa: string = '';
  anioInicio: number | null = null;
  trabajaActualmente: boolean = false;
  anioTermino: number | null = null;
  cargo: string = '';

  experiencias: any[] = [];

  async ngOnInit() {
    await this.cargarExperiencias();
  }

  async cargarExperiencias() {
    this.experiencias = await this.dbService.getExperience(this.usuario);
  }

  async guardar() {
    if (!this.empresa || !this.anioInicio || !this.cargo) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor complete los campos obligatorios',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    await this.dbService.saveExperience({
      usuario: this.usuario,
      empresa: this.empresa,
      anioInicio: this.anioInicio,
      trabajaActualmente: this.trabajaActualmente,
      anioTermino: this.trabajaActualmente ? null : this.anioTermino,
      cargo: this.cargo
    });

    await this.cargarExperiencias();
    this.limpiar();
  }

  limpiar() {
    this.empresa = '';
    this.anioInicio = null;
    this.trabajaActualmente = false;
    this.anioTermino = null;
    this.cargo = '';
  }
}
