import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class FollowingsService {
  constructor(private webService: WebService) {}
  followUser(userid: any) {
    return this.webService.put('user/follow/', { userid });
  }
  isFollowing(userid: any) {
    return this.webService.get(`user/follow/${userid}`);
  }
  getFollowings(userid: any) {
    return this.webService.get(`user/followings/${userid}`);
  }
}
