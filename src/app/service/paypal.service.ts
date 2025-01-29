import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private baseUrl = 'http://localhost:8080/payment';

  constructor(private http: HttpClient) { }

  createPayment(paymentDetails: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(
      `${this.baseUrl}/pay`,
      paymentDetails,
      { headers }
    );
  }

  // Add method to verify payment status
  verifyPayment(paymentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/verify/${paymentId}`);
  }
}
