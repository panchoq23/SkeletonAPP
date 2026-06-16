import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DBTaskService } from '../services/dbtask.service';

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const dbService = inject(DBTaskService);
  const router = inject(Router);

  await dbService.initializePlugin();

  const activeSession = await dbService.isSessionActive();
  if (activeSession) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
