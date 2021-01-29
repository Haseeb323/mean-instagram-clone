import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.scss'],
})
export class TutorialsListComponent implements OnInit {
  tutorials: Tutorial[] = [];
  currentTutorial?: Tutorial;
  currentIndex = -1;
  title = '';

  page = 1;
  count = 1;
  pageSize = 1;
  pageSizes = [3, 6, 9];
  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
  }
  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    // tslint:disable-next-line:prefer-const
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveTutorials(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.tutorialService
      .getAll('6013ad2e4b96d727ccdce1d3', this.pageSize)
      .subscribe(
        (response) => {
          const { posts, total } = response;
          this.tutorials = posts;
          this.count = total;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveTutorials();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }
}
