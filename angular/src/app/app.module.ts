import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ToolbarComponent } from './components/misc/toolbar/toolbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PrimengModule } from './modules/primeng';

const AUTH_IGNORED_PATHS = ['/home'];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ProfileComponent,
    HomeComponent,
  ],
  imports: [
    AuthModule.forRoot({
      clientId: environment.auth0.clientId,
      domain: environment.auth0.domain,

      authorizationParams: {
        audience: environment.auth0.audience,
        redirect_uri: environment.auth0.redirectUrl,
      },
      cacheLocation: 'localstorage',
      skipRedirectCallback: AUTH_IGNORED_PATHS.includes(
        window.location.pathname
      ),
    }),
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
