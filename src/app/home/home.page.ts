import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from './components/certificaciones/certificaciones.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel,
    MisDatosComponent, ExperienciaLaboralComponent, CertificacionesComponent,
    CommonModule, FormsModule
  ],
})
export class HomePage implements OnInit {
  private readonly userService = inject(UserService);

  usuario: string = '';
  selectedSegment: string = 'mis-datos';

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.usuario;
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
