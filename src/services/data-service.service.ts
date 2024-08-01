import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  aircrafts: any[] = [];
  flights: any[] = [];
  rotations = new Map();
  selectedAircraft = '';

  constructor() {}

  constructAircrafts(rawAircrafts: any) {
    this.aircrafts = rawAircrafts;
    this.aircrafts.forEach((aircraft) => {
      aircraft['utilisation'] = '0.00';
    })
  }

  constructRotation() {
    this.aircrafts.forEach((aircraft) => {
      this.rotations.set(aircraft.ident, []);
    });
    this.selectedAircraft = this.aircrafts[0].ident;
  }

  setSelectedAircraft(index: number) {
    this.selectedAircraft = this.aircrafts[index].ident;
  }

  getSelectedAircraftRotation() {
    return this.rotations.get(this.selectedAircraft);
  }

  getLatestRotationDestination() {
    let currentRotation = this.getSelectedAircraftRotation();
    if (currentRotation.length > 0) {
      return currentRotation[currentRotation.length - 1].destination;
    } else {
      return;
    }
  }

  getLatestArrivalTime() {
    let currentRotation = this.getSelectedAircraftRotation();
    if (currentRotation.length > 0) {
      return currentRotation[currentRotation.length - 1].arrivaltime;
    } else {
      return;
    }
  }

  addFlightToAircraft(flightIdent: string) {
    let currentRotation = this.getSelectedAircraftRotation();
    let selectedFlightIndex = this.flights.findIndex(
      (flight) => flight.ident === flightIdent
    );
    let selectedFlight = this.flights[selectedFlightIndex];

    currentRotation.push(selectedFlight);
    currentRotation.sort((a: any, b: any) => a.departuretime - b.departuretime);
    this.rotations.set(this.selectedAircraft, currentRotation);

    this.flights.splice(selectedFlight, 1);
    console.log('[AS-TL] Current Available Flights: ', this.flights);
  }

  returnFlight(flight: any) {
    this.flights.push(flight);
    this.flights.sort((a, b) => {
      if (a.ident < b.ident) return -1;
      if (a.ident > b.ident) return 1;
      return 0;
    });
    console.log('[AS-TL] Current Available Flights: ', this.flights);
  }

  updateUtilisation(utilisation: number) {
    let index = this.aircrafts.findIndex((aircraft) => 
      aircraft.ident === this.selectedAircraft
    )
    this.aircrafts[index].utilisation = utilisation.toFixed(2);
  }
}
