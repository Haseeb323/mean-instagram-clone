import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private webService: WebService) {}
  getPosts(_userid: any, pagenumber: number) {
    return this.webService.get(`posts/${_userid}/${pagenumber}`);
  }
}
