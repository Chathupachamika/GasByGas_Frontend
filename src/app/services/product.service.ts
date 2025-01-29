import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

export interface GasDTO {
  id?: number;
  name: string;
  capacity: number;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/gas';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  createProduct(product: GasDTO): Observable<GasDTO> {
    console.log('Service sending request to:', this.apiUrl);
    console.log('Request payload:', product);
    
    return this.http.post<GasDTO>(this.apiUrl, product, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  getAllProducts(): Observable<GasDTO[]> {
    return this.http.get<GasDTO[]>(this.apiUrl);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('Delete API Error:', error);
          throw error;
        })
      );
  }

  updateProduct(id: number, product: GasDTO): Observable<GasDTO> {
    return this.http.put<GasDTO>(`${this.apiUrl}/${id}`, product, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('Update API Error:', error);
          throw error;
        })
      );
  }
}
