import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle,
  NavController
} from "@ionic/angular/standalone";
import { RouterLinkActive, RouterLink } from "@angular/router";
import { addIcons } from "ionicons";
import {
  homeOutline, logOutOutline, listOutline, personOutline,
  mapOutline, cameraOutline, addCircleOutline,
  businessOutline
} from "ionicons/icons";
import { AuthService }   from "./services/auth.service";
import { DBTaskService } from "./services/dbtask.service";
import { UserService }   from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [
    CommonModule, RouterLinkActive, RouterLink,
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle,
  ],
})
export class AppComponent implements OnInit {
  private readonly authService  = inject(AuthService);
  private readonly dbService    = inject(DBTaskService);
  private readonly userService  = inject(UserService);
  private readonly navCtrl      = inject(NavController);

  usuario: string = "";

  constructor() {
    addIcons({
      homeOutline, logOutOutline, listOutline, personOutline,
      mapOutline, cameraOutline, addCircleOutline, businessOutline
    });
  }

  async ngOnInit() {
    await this.dbService.initializePlugin();

    const session = await this.dbService.isSessionActive();
    if (session) {
      const dbUser = await this.dbService.getUser(session.user_name);
      this.userService.setUserData(dbUser ?? { usuario: session.user_name });
    }

    this.userService.userData$.subscribe(u => {
      this.usuario = u?.nombre || u?.usuario || "";
    });
  }

  goToProfile() {
    this.navCtrl.navigateForward("/home", { queryParams: { segment: "perfil" } });
  }

  async logout() {
    await this.authService.logout();
    this.navCtrl.navigateRoot("/welcome");
  }
}
