import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DataService } from '../../../services/data-service.service';

@Component({
  selector: 'flights',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css',
})
export class FlightsComponent {
  constructor(private dataService: DataService) {}

  @Output() selectedFlight = new EventEmitter<any>();

  flights: any[] = [];

  ngOnInit(): void {
    this.flights = this.dataService.flights;
  }

  onSelect(index: number) {
    console.log(`[AS-TL]Flight ${this.flights[index].ident} was selected.`);
    this.dataService.addFlightToAircraft(this.flights[index].ident);
    this.filterValidFlights();
    this.selectedFlight.emit();
  }

  filterValidFlights() {
    let latestDestination = this.dataService.getLatestRotationDestination();
    let latestArrivalTime = this.dataService.getLatestArrivalTime();
    if (latestDestination) {
      this.flights = this.dataService.flights.filter(
        (flight) =>
          flight.origin === latestDestination &&
          flight.arrivaltime < 86400 && //prevent overnight flight
          flight.departuretime > latestArrivalTime &&
          (flight.departuretime - latestArrivalTime) / 60 >= 20
      );
    } else {
      this.flights = this.dataService.flights;
    }
  }
}
