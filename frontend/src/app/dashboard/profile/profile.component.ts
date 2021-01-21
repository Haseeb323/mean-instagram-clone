import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  closeResult = '';
  selectedFile!: File;
  constructor(
    private modalService: NgbModal,
    private authService: AuthService
  ) {}
  ngOnInit(): void {}

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
  onUpload() {
    // this.http is the injected HttpClient
    const uploadData = new FormData();
    uploadData.append('image_url', this.selectedFile, this.selectedFile.name);
    this.authService.uploadProfile(uploadData).subscribe(
      (event: any) => {
        console.log(event); // handle event here
      },
      (err) => {
        console.log(err);
        alert('error uploading image');
      },
      () => {}
    );
  }
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
}
