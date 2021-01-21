import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  name: string = '';
  email: string = '';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.info().subscribe((res: any) => {
      this.name = res.name;
      this.email = res.email;
    });
  }
}
