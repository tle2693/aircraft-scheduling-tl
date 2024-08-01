import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}
  readonly host = 'http://localhost:3000/api'

  private get(url: string) {
    return this.httpClient.get(`${this.host}/${url}`);
  }

  getAircrafts() {
    return this.get('aircrafts');
  }

  getFlights() {
    return this.get('flights');
  }
}
