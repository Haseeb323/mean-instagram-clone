import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  constructor(private webService: WebService) {}
  getAll(_userid: any, pagenumber: number): Observable<any> {
    return this.webService.get(`posts/${_userid}/${pagenumber}`);
  }
}
