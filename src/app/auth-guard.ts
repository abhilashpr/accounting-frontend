import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';// Assuming you have an AuthService
import { Auth } from './service/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Get the roles required for this route from the route's data
  const requiredRoles = route.data['roles'] as string[];

  // Get the current user's role from your authentication service
  const userRole = authService.getUserRole(); // e.g., 'admin', 'user'
  if(!userRole){
    router.navigate(['auth/login']);
    return false;
  }
  if(!requiredRoles && authService.getLocalAccessToken()){
    return true
  }
  // If no roles are defined for the route, or if the user's role is in the list
  if (requiredRoles.includes(userRole)) {
    return true; // Allow access
  } else {
    // Redirect to an unauthorized page and block access
    router.navigate(['/unauthorized']); 
    return false;
  }
};