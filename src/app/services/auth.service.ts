import { Injectable, inject } from "@angular/core";
import { DBTaskService } from "./dbtask.service";
import { StorageService } from "./storage.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private dbTask = inject(DBTaskService);
  private storage = inject(StorageService);
  private userService = inject(UserService);

  async isAuthenticated(): Promise<boolean> {
    const session = await this.dbTask.isSessionActive();
    return !!session;
  }

  async login(user: string, pass: string): Promise<boolean> {
    const valid = await this.dbTask.validateUser(user, pass);
    if (valid) {
      await this.dbTask.registerSession(user, pass);
      await this.storage.set("active_user", user);
      this.userService.setUserData({ usuario: user });
      return true;
    }
    return false;
  }

  async logout() {
    const user = this.userService.getUserData();
    if (user) {
      await this.dbTask.updateSessionStatus(user.usuario, false);
    }
    await this.storage.remove("active_user");
    this.userService.clearUserData();
  }
}
