import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { DataService } from '../../../services/data-service.service';

@Component({
  selector: 'aircrafts',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './aircrafts.component.html',
  styleUrl: './aircrafts.component.css',
})
export class AircraftsComponent {

  constructor(private dataService: DataService) {}

  @Output() selectedAircraft = new EventEmitter<any>();
  aircrafts: any[] = [];
  selectedIndex = 0;

  ngOnInit(): void {
    this.aircrafts = this.dataService.aircrafts;
  }

  onAircraftSelected(index: number) {
    this.selectedIndex = index;
    console.log(`[AS-TL] Aircraft ${this.aircrafts[index].ident} was selected.`, this.aircrafts[index]);
    this.dataService.setSelectedAircraft(index);
    this.selectedAircraft.emit();
  }
}
