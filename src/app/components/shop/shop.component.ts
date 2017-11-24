import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  displayCart: false;
  user: User;
  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser;
  }

  ngOnInit() {

  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth', 'login']);
  }

}
