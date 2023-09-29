import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SpinnerService } from './services/spinner/spinner.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  items: MenuItem[];

  userItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-fw pi-pencil', routerLink: '/profile' },
  ];

  constructor(
    public spinner: SpinnerService,
    private userService: UserService
  ) {
    this.items = [
      {
        label: 'Bets',
        routerLink: '/bets',
      },
      {
        label: 'Leaderboard',
        routerLink: '/leaderboard',
      },
      // {
      //   label: 'My History',
      //   routerLink: '/my-history',
      // },
    ];
  }

  ngOnInit(): void {}
}
