import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public hostAddress = '';
  constructor(private webService: WebService) {
    this.hostAddress = webService.HOST_BASE_ADDRESS;
  }

  login(payload: object) {
    return this.webService.login('auth/login', payload);
  }
  register(payload: object) {
    return this.webService.post('auth/register', payload);
  }
  uploadProfile(payload: any) {
    return this.webService.postImage('auth/profileimage', payload);
  }
  info() {
    return this.webService.get('auth/info');
  }
  userInfo(userid: any) {
    return this.webService.get(`auth/info/${userid}`);
  }
  getUsers() {
    return this.webService.get('auth/all');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
