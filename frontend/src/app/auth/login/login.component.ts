import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitBtn: boolean = false;
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  showToast(message: string, type: string) {
    let classname =
      type === 'success' ? 'bg-success text-light' : 'bg-danger text-light';
    this.toastService.show(message, {
      classname,
      delay: 2000,
    });
  }
  login(form: NgForm) {
    //console.log(form.value);
    this.submitBtn = true;
    const { email, password } = form.value;
    this.authService.login({ email, password }).subscribe(
      (res: HttpResponse<any>) => {
        //console.log(res);
        const token: any = res.headers.get('auth-token');
        //console.log(token);
        localStorage.setItem('token', token);
        //this.showToast('Login Successfuly', 'success');

        this.router.navigate(['/dashboard']);

        //console.log();
      },
      (err: HttpErrorResponse) => {
        let { error } = err;
        let message = 'Unkown error';
        console.log(error.message);
        if (error.hasOwnProperty('message')) message = error.message;
        this.showToast(message, 'danger');
        this.submitBtn = false;
      },
      () => {
        this.submitBtn = false;
      }
    );
    //form.reset();
  }
}
