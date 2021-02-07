import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Followings } from 'src/app/models/followings.model';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FollowingsService } from 'src/app/services/followings.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  user!: User;
  users: User[] = [];
  baseUrl = '';
  followings!: any[];
  constructor(
    private authService: AuthService,
    private followingsService: FollowingsService
  ) {
    this.baseUrl = authService.hostAddress;
  }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.authService.info().subscribe(
      (res: any) => {
        this.user = res;
        //console.log(res);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      },
      () => {
        this.getUsers();
      }
    );
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (res: any) => {
        this.users = res.users;
        //console.log(this.users);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      },
      () => {
        this.followingsService.getUserFollowings().subscribe(
          (res: any) => {
            this.followings = res.follow[0].followings;
          },
          (err: HttpErrorResponse) => {
            console.log(err);
          },
          () => {
            let users = this.users;
            users.map((user: User) => {
              user.isFollowing = false;
              this.followings.forEach((follow) => {
                if (follow === user._id) {
                  user.isFollowing = true;
                  return;
                }
              });
              return user;
            });
            this.users = users;
            //console.log(users);
          }
        );
      }
    );
  }
}
