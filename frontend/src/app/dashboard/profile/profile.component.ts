import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { FollowingsService } from 'src/app/services/followings.service';
import { PostService } from 'src/app/services/post.service';
import { WebService } from 'src/app/services/web.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  mainUser: boolean = false;
  POSTS: any[] = [];
  currentPost?: any;
  currentIndex = -1;
  totalPosts: number = 0;

  page: number = 1;
  count: number = 1;
  pageSize: number = 1;

  closeResult = '';
  selectedFile!: File;
  followers: [] = [];
  followings: [] = [];
  isFollowing: boolean = false;
  postImageUrl: string = '';
  baseUrl = '';
  user: any = {
    _id: '',
    name: '',
    username: '',
    email: '',
    image_url: '',
  };
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private webService: WebService,
    private postService: PostService,
    private followingsService: FollowingsService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.baseUrl = this.webService.HOST_BASE_ADDRESS;
    this.activatedRoute.params.subscribe((res) => {
      if (res.hasOwnProperty('userid')) {
        this.authService.userInfo(res.userid).subscribe((resp: any) => {
          this.user = resp;
          this.authService.info().subscribe(
            (res: any) => {
              if (res._id === this.user._id) {
                this.mainUser = true;
              }
            },
            (err) => console.log(err),
            () => {
              this.retrievePosts();
              this.getFollowings();
              this.followingsService
                .isFollowing(this.user._id)
                .subscribe((resp: any) => {
                  this.isFollowing = resp.following;
                });
            }
          );
        });
      }
    });
  }
  followUser() {
    this.followingsService.followUser(this.user._id).subscribe(
      (res) => {
        this.isFollowing = !this.isFollowing;
        this.getFollowings();
      },
      (err: HttpErrorResponse) => console.log(err)
    );
  }
  /*Modal Code*/
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  getFollowings() {
    this.followingsService.getFollowings(this.user._id).subscribe(
      (result: any) => {
        this.followings = result.followings[0].users;
        this.followers = result.followers[0].users;
        console.log(this.followers);
      },
      (err) => console.log(err)
    );
  }

  /*uploading file*/
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }
  onPostImageChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.onProfileImageUpload();
  }
  onProfileImageUpload() {
    const uploadData = new FormData();
    uploadData.append('image_url', this.selectedFile, this.selectedFile.name);
    this.postService.addPostImage(uploadData).subscribe(
      (event: any) => {
        if (event.body) {
          this.postImageUrl = `${this.baseUrl}/${event.body.image_url}`;
          //console.log(this.postImageUrl);
          //this.modalService.dismissAll('Profile Image Uploaded');
        }
      },
      (err) => {
        console.log(err);
        alert('error uploading image');
      }
    );
  }

  onUpload() {
    const uploadData = new FormData();
    uploadData.append('image_url', this.selectedFile, this.selectedFile.name);
    this.authService.uploadProfile(uploadData).subscribe(
      (event: any) => {
        if (event.body) {
          this.user.image_url = `${this.webService.HOST_BASE_ADDRESS}/${event.body.image_url}`;
          //console.log(this.user.image_url);
          this.modalService.dismissAll('Image Uploaded');
        }
      },
      (err) => {
        console.log(err);
        alert('error uploading image');
      },
      () => {}
    );
  }

  retrievePosts(): void {
    this.postService.getPosts(this.user._id, this.page).subscribe(
      (response: any) => {
        const { posts, total, size_per_page } = response;
        this.POSTS = posts;
        this.totalPosts = total;
        this.count = total / size_per_page;
        //console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrievePosts();
  }
  onAddNewPost(data: NgForm) {
    console.log(data.value);
    if (this.postImageUrl == '') return;

    const { title, description } = data.value;
    this.postService
      .addPost({
        title,
        description,
        image_url: this.postImageUrl,
      })
      .subscribe(
        (resp: any) => {
          console.log(resp);
          let sample = this.POSTS;
          sample.unshift(resp);
          this.POSTS = sample;
          this.totalPosts++;
        },
        (err: HttpErrorResponse) => console.log(err),
        () => {
          this.postImageUrl = '';
          this.modalService.dismissAll('Post Uploaded');
        }
      );
  }
}
