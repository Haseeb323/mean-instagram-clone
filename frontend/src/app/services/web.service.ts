import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  readonly HOST!: string;
  readonly HOST_BASE_ADDRESS!: string;
  constructor(private http: HttpClient) {
    this.HOST = 'http://localhost:4040/api';
    this.HOST_BASE_ADDRESS = 'http://localhost:4040';
  }
  login(uri: string, payload: any) {
    let newHeaders = new HttpHeaders({
      'content-type': 'application/json',
    });
    return this.http.post(`${this.HOST}/${uri}`, payload, {
      headers: newHeaders,
      observe: 'response',
    });
  }
  get(uri: string) {
    return this.http.get(`${this.HOST}/${uri}`);
  }
  post(uri: string, payload: any) {
    return this.http.post(`${this.HOST}/${uri}`, payload);
  }
  postImage(uri: string, payload: any) {
    return this.http.post(`${this.HOST}/${uri}`, payload, {
      reportProgress: true,
      observe: 'events',
    });
  }

  put(uri: string, payload: any) {
    return this.http.put(`${this.HOST}/${uri}`, payload);
  }
  delete(uri: string) {
    return this.http.get(`${this.HOST}/${uri}`);
  }
}
