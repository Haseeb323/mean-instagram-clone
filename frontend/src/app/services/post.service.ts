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
  addPostImage(payload: any) {
    return this.webService.postImage('posts/postimage', payload);
  }
  addPost(payload: any) {
    return this.webService.post('posts/add', payload);
  }
  getMyPosts(pagenumber: number) {
    return this.webService.get(`posts/all/${pagenumber}/posts`);
  }
}
