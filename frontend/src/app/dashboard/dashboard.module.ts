import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [DashboardComponent, HomeComponent, ProfileComponent],

  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class DashboardModule {}
