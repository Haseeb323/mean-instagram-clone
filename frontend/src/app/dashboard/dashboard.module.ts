import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [DashboardComponent, HomeComponent, ProfileComponent],

  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
