import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { WebService } from 'src/app/services/web.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  POSTS: any = [];
  closeResult = '';
  selectedFile!: File;
  user: any = {
    _id: '',
    name: '',
    username: '',
    followers: [],
    followings: [],
    email: '',
    image_url: '',
  };
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private webService: WebService,
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      if (res.hasOwnProperty('userid')) {
        this.authService.userInfo(res.userid).subscribe((resp: any) => {
          this.user = resp;
          this.postService
            .getPosts(this.user._id, 1)
            .subscribe((posts: any) => {
              this.POSTS = posts;
            });
          //console.log(resp);
        });
      }
    });
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

  /*uploading file*/
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.onUpload();
  }
  onUpload() {
    const uploadData = new FormData();
    uploadData.append('image_url', this.selectedFile, this.selectedFile.name);
    this.authService.uploadProfile(uploadData).subscribe(
      (event: any) => {
        if (event.body) {
          this.user.image_url = `${this.webService.HOST_BASE_ADDRESS}/${event.body.image_url}`;
          console.log(this.user.image_url);

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
}
