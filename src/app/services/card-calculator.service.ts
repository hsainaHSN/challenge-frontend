import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { ICalculator } from '../interfaces/calculator';

@Injectable({
  providedIn: 'root'
})
export class CardCalculatorService {
  private apiUrl = environment.apiUrl + "/search-combination";

  constructor(private http: HttpClient) { }

  getCombination(amount: number): Observable<HttpResponse<ICalculator>> {
    return this.http.get<ICalculator>(`${this.apiUrl}?amount=${amount}`, { observe: 'response' });
  }
}
