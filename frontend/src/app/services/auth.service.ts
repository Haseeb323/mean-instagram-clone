import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private webService: WebService) {}
  login(payload: object) {
    return this.webService.login('auth/login', payload);
  }
  register(payload: object) {
    return this.webService.post('auth/register', payload);
  }
  info() {
    return this.webService.get('auth/info');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
