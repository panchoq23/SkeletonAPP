import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, logOutOutline } from 'ionicons/icons';
import { DBTaskService } from './services/dbtask.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle],
})
export class AppComponent implements OnInit {
  private readonly dbService = inject(DBTaskService);
  private readonly userService = inject(UserService);
  private readonly navCtrl = inject(NavController);

  constructor() {
    addIcons({ homeOutline, logOutOutline });
  }

  async ngOnInit() {
    await this.dbService.initializePlugin();

    // Detectar si existe una sesión activa al iniciar
    const activeSession = await this.dbService.isSessionActive();
    if (activeSession) {
      this.userService.setUserData({ usuario: activeSession.usuario });
      this.navCtrl.navigateRoot('/home');
    }
  }

  async logout() {
    const userData = this.userService.getUserData();
    if (userData) {
      await this.dbService.updateSessionStatus(userData.usuario, false);
    }
    this.userService.clearUserData();
    this.navCtrl.navigateRoot('/welcome');
  }
}
