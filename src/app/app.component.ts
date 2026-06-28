import { Component, inject, OnInit } from "@angular/core";
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, NavController } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { 
  homeOutline, logOutOutline, listOutline, personOutline, 
  mapOutline, cameraOutline, addCircleOutline 
} from "ionicons/icons";
import { AuthService } from "./services/auth.service";
import { DBTaskService } from "./services/dbtask.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle],
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dbService = inject(DBTaskService);
  private readonly navCtrl = inject(NavController);
  private readonly router = inject(Router);

  constructor() {
    addIcons({ 
      homeOutline, logOutOutline, listOutline, personOutline, 
      mapOutline, cameraOutline, addCircleOutline 
    });
  }

  async ngOnInit() {
    await this.dbService.initializePlugin();
  }

  goToProfile() {
    this.router.navigate(["/home"], { queryParams: { segment: "perfil" } });
  }

  async logout() {
    await this.authService.logout();
    this.navCtrl.navigateRoot("/welcome");
  }
}
