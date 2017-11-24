import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [MessageService]
})
export class AuthComponent implements OnInit {
  public loginForm = this.fb.group({
    login: [null, Validators.required],
    password: [null, Validators.required]
  });
  public regForm = this.fb.group({
    login: [null, Validators.required],
    password: [null, Validators.required],
    phone: [null, Validators.required]
  });
  msg;
  index;
  constructor(public fb: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private activeRouter: ActivatedRoute) {
    this.activeRouter.params.subscribe( params => {
      switch (params.action) {
        case 'login': this.index = 0; break;
        case 'reg': this.index = 1; break;
      }
    } );
  }

  ngOnInit() {
  }

  Login(event) {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(data => {
        if (!data.success) {
          this.messageService.add({severity: 'warn', summary: 'Login', detail: data.message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Login', detail: data.message});
          localStorage.setItem('id', data.id);
          localStorage.setItem('login', data.login);
          localStorage.setItem('phone', data.phone);
          localStorage.setItem('token', data.token);
          this.router.navigateByUrl('/');
        }
      });
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Login', detail: 'Form not valid'});
    }
  }

  Reg(event) {
    if (this.regForm.valid) {
      this.authService.register(this.regForm.value).subscribe(data => {
        if (!data.success) {
          this.messageService.add({severity: 'warn', summary: 'Login', detail: data.message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Login', detail: data.message});
          this.loginForm.reset();
          this.regForm.reset();
          this.index = 0;
        }
      });
    }
    else {
      this.messageService.add({severity: 'warn', summary: 'Register', detail: 'Form not valid'});
    }

  }

  get login_LoginForm() { return this.loginForm.get('login'); }
  get password_LoginForm() { return this.loginForm.get('password'); }
  get login_RegForm() { return this.regForm.get('login'); }
  get password_RegForm() { return this.regForm.get('password'); }


}
