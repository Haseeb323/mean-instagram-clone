import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  POSTS: any[] = [];
  currentPost?: any;
  currentIndex = -1;
  totalPosts: number = 0;

  page: number = 1;
  count: number = 1;
  pageSize: number = 1;
  user: User = {
    name: '',
    username: '',
    email: '',
    _id: '',
    image_url: '',
    followers: [],
    followings: [],
    isFollowing: false,
    date: '',
  };
  baseUrl: any = '';
  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}
  ngOnInit(): void {
    this.baseUrl = this.authService.hostAddress;
    this.authService.info().subscribe(
      (res: any) => {
        this.user = res;
        //console.log(this.user);
      },
      (err: HttpErrorResponse) => console.log,
      () => {
        this.retrievePosts();
      }
    );
  }
  retrievePosts() {
    this.postService.getMyPosts(1).subscribe(
      (res: any) => {
        let { posts, perPageResults, totalposts } = res;
        this.POSTS = posts;
        this.totalPosts = totalposts;
        this.count = totalposts / perPageResults;
      },
      (err: HttpErrorResponse) => console.log,
      () => {}
    );
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrievePosts();
  }
}
