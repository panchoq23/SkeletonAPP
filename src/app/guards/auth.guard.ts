import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DBTaskService } from '../services/dbtask.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const dbService = inject(DBTaskService);
  const userService = inject(UserService);
  const router = inject(Router);

  // Asegurarse de que el plugin esté inicializado
  await dbService.initializePlugin();

  const activeSession = await dbService.isSessionActive();
  if (activeSession) {
    // Si hay sesión en BD pero no en el servicio en memoria, sincronizar
    if (!userService.getUserData()) {
      userService.setUserData({ usuario: activeSession.user_name });
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};
