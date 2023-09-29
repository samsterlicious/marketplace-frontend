import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BetComponent } from './components/bet/bet.component';
import { BetsComponent } from './components/bets/bets.component';
import { CompetitorComponent } from './components/competitor/competitor.component';
import { EspnInfoComponent } from './components/dialogs/espn-info/espn-info.component';
import { EventInfoComponent } from './components/dialogs/event-info/event-info.component';
import { EventComponent } from './components/event/event.component';
import { GameDisplayComponent } from './components/game-display/game-display.component';
import { HomeComponent } from './components/home/home.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ToolbarComponent } from './components/misc/toolbar/toolbar.component';
import { MyBetsComponent } from './components/my-bets/my-bets.component';
import { MyHistoryComponent } from './components/my-history/my-history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { IdentityTokenInterceptor } from './interceptors/identityToken';
import { PrimengModule } from './modules/primeng';
import { ReversePipe } from './pipe/reverse.pipe';

const AUTH_IGNORED_PATHS = ['/home'];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ProfileComponent,
    HomeComponent,
    EventComponent,
    CompetitorComponent,
    BetsComponent,
    GameDisplayComponent,
    EventInfoComponent,
    BetComponent,
    LeaderboardComponent,
    MyHistoryComponent,
    EspnInfoComponent,
    MyBetsComponent,
    ReversePipe,
  ],
  imports: [
    AuthModule.forRoot({
      clientId: environment.auth0.clientId,
      domain: environment.auth0.domain,
      authorizationParams: {
        audience: environment.auth0.audience,
        redirect_uri: environment.auth0.redirectUrl,
      },
      cacheLocation: 'memory',
      // skipRedirectCallback: AUTH_IGNORED_PATHS.includes(
      //   window.location.pathname
      // ),
    }),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PrimengModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IdentityTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
