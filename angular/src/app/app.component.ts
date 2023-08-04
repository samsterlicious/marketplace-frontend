import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpinnerService } from './services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  authSub: Subscription;

  userItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-fw pi-pencil', routerLink: '/profile' },
    {
      label: 'Sign out',
      command: () => {
        this.auth.logout({
          logoutParams: { returnTo: environment.auth0.redirectUrl },
        });
      },
    },
  ];

  constructor(private auth: AuthService, public spinner: SpinnerService) {
    this.authSub = this.auth.user$.subscribe({
      next: (user) => {
        if (!user) {
          this.userItems = [
            {
              label: 'Sign In',
              command: () => {
                this.auth.loginWithRedirect();
              },
            },
          ];
        }
      },
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
