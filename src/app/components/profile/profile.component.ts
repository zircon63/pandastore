import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {MessageService} from 'primeng/components/common/messageservice';
import {TreeNode} from "primeng/primeng";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  orders: TreeNode;
  user: User;
  products;
  msg;
  constructor(private authService: AuthService, private messageService: MessageService) {}

  ngOnInit() {
    this.user = this.authService.getUser;
    this.authService.getProfile(this.user).subscribe(data => {
      if (data.success) {
        this.orders = <TreeNode[]>data.orders;
      }
      else {
        this.messageService.add({severity: 'warn', summary: 'Get Orders', detail: data.message});
      }
    });
  }

}
