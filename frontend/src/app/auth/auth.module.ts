import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './toasts-container.component';

@NgModule({
  imports: [AuthRoutingModule, NgbModule, CommonModule, FormsModule],
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    LogoutComponent,
    ToastsContainer,
  ],
})
export class AuthModule {}
