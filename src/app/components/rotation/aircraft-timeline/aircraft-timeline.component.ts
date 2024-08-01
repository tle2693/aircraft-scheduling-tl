import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'aircraft-timeline',
  standalone: true,
  imports: [CommonModule],
  providers:[DatePipe],
  templateUrl: './aircraft-timeline.component.html',
  styleUrl: './aircraft-timeline.component.css',
})
export class AircraftTimelineComponent {

  @Input() currentTimeline!: any[];
  todayDate = new Date();
  formatedTodayDate!:string;

  constructor(private datePipe: DatePipe) {};

  ngOnInit(): void {
    this.formatedTodayDate = this.getTodayDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  getTodayDate(){
    let formatedDate = this.datePipe.transform(this.todayDate, 'MMMM d, y');
    return formatedDate ?? '';
  }
}
