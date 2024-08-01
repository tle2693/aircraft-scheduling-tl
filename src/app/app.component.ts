import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ApiService } from '../services/api-service.service';
import { DataService } from '../services/data-service.service';

import { AircraftsComponent } from './components/aircrafts/aircrafts.component';
import { FlightsComponent } from './components/flights/flights.component';
import { RotationComponent } from './components/rotation/rotation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AircraftsComponent,
    FlightsComponent,
    RotationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) {}

  @ViewChild(RotationComponent) rotationComponent!: RotationComponent;
  @ViewChild(FlightsComponent) flightsComponent!: FlightsComponent;
  title = 'aircraft-scheduling';
  finishedFetching = false;

  async ngOnInit(): Promise<void> {
    await firstValueFrom(this.apiService.getAircrafts())
      .then((response: any) => {
        this.dataService.constructAircrafts(response);
        this.dataService.constructRotation();
      })
      .catch((error: any) => {
        console.error('[AS-TL] failed to fetch aircraft data!');
      });
    await firstValueFrom(this.apiService.getFlights())
      .then((response: any) => {
        this.dataService.flights = response;
      })
      .catch((error: any) => {
        console.error('[AS-TL] failed to fetch flights data');
      });
    this.finishedFetching = true;
  }

  updateRotation() {
    this.rotationComponent.getCurrentRotation();
  }

  updateValidFlights() {
    this.flightsComponent.filterValidFlights();
  }
}
