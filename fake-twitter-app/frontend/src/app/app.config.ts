import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter }                     from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations }                  from '@angular/platform-browser/animations';
import { MatSnackBarModule }                  from '@angular/material/snack-bar';

import { routes }            from './app.routes';
import { httpInterceptor }   from './core/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([ httpInterceptor ])),
    provideAnimations(),

    importProvidersFrom(MatSnackBarModule)
  ]
};
