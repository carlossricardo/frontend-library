import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { TokenService } from 'src/app/features/auth/services/token.service';

export const signInGuard: CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const tokenService = inject( TokenService );
  const router = inject( Router );

    const token = tokenService.getToken();

    if( token ){
      router.navigate(['']);
      return false;
    }

    return true;
};
