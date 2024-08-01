import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { DataService } from '../../../services/data-service.service';

import { AircraftTimelineComponent } from './aircraft-timeline/aircraft-timeline.component';

@Component({
  selector: 'rotation',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatButtonModule, MatIconModule, AircraftTimelineComponent],
  templateUrl: './rotation.component.html',
  styleUrl: './rotation.component.css'
})
export class RotationComponent {

  constructor(private dataService: DataService, private dialog: MatDialog){}

  @Output() onFlightRemove = new EventEmitter<any>();
  currentRotation!: any[]; 
  aircraftTimeline!: any[];
  currentAircraft = '';
  toBeRemovedFlightIndex!: number;
  clearingFlight = false;

  ngOnInit(): void {
    this.getCurrentRotation();
  }

  getCurrentRotation() {
    this.currentAircraft = this.dataService.selectedAircraft;
    this.currentRotation = this.dataService.getSelectedAircraftRotation();
    this.calculateUtilisation();
    this.constructTimeline();
    console.log('[AS-TL] Current aircraft',this.currentAircraft, 'rotation: ', this.currentRotation);
  }

  removeFlightClick(index: number) {
    console.log('[AS-TL] flight to be removed: ', this.currentRotation![index]);
    if(index !== this.currentRotation.length - 1 && index !== 0) {
      this.clearingFlight = true;
      this.toBeRemovedFlightIndex = index;
    } else {
      this.dataService.returnFlight(this.currentRotation![index]);
      this.currentRotation!.splice(index, 1);
      this.removeFlight();
    }
  }

  onModalContinue() {
    for (let i = this.toBeRemovedFlightIndex; i < this.currentRotation.length; i++) {
      this.dataService.returnFlight(this.currentRotation[i]);
    }
    this.currentRotation!.splice(this.toBeRemovedFlightIndex, this.currentRotation.length - this.toBeRemovedFlightIndex);
    this.removeFlight();
    this.clearingFlight = false;
  }

  onModalCancel() {
    this.clearingFlight = false;
  }

  calculateUtilisation() {
    let utilizedTime = 0
    this.currentRotation.forEach((flight) => {
      utilizedTime += flight.arrivaltime - flight.departuretime;
    })
    const utilisation = utilizedTime / 60 / 60 / 24 * 100;
    this.dataService.updateUtilisation(utilisation);
  }

  constructTimeline() {
    this.aircraftTimeline = [];
    for (let i = 0; i < this.currentRotation.length; i++) {
      let serviceBlock = {
        start: '',
        width: '',
        color: '#429E70'
      }
      serviceBlock.start = (this.currentRotation[i].departuretime / 86400 * 100).toFixed(2);
      serviceBlock.width = ((this.currentRotation[i].arrivaltime - this.currentRotation[i].departuretime) / 86400 * 100).toFixed(2);
      this.aircraftTimeline.push(serviceBlock);
      if (this.currentRotation[i+1]) {
        let turnaroundBlock = {
          start: '',
          width: '',
          color: '#70163C'
        }
        turnaroundBlock.start = (this.currentRotation[i].arrivaltime / 86400 * 100).toFixed(2);
        turnaroundBlock.width = ((this.currentRotation[i+1].departuretime - this.currentRotation[i].arrivaltime) / 86400 * 100).toFixed(2);
        this.aircraftTimeline.push(turnaroundBlock);
      }
    }
  }

  removeFlight() {
    this.calculateUtilisation();
    this.constructTimeline();
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.onFlightRemove.emit();
  }
}
