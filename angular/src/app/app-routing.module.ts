import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { BetsComponent } from './components/bets/bets.component';
import { HomeComponent } from './components/home/home.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { MyHistoryComponent } from './components/my-history/my-history.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'bets', component: BetsComponent, canActivate: [AuthGuard] },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-history',
    component: MyHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
