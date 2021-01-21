import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
  register(form: NgForm) {
    //console.log(form.value);
    this.submitBtn = true;
    const { name, email, password } = form.value;
    console.log({ name, email, password });

    this.authService.register({ name, email, password }).subscribe(
      (res: any) => {
        this.showToast('User registered successfuly', 'success');
        console.log(res);

        this.router.navigate(['/']);
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
