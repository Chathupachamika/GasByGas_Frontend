import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService { // changed from GasCollectService to OrderService
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Delivery Schedule APIs
  addDeliverySchedule(deliveryCompletionDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/delieveryShedule`, deliveryCompletionDTO);
  }

  sendNotificationToCustomer(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/delieveryShedule`);
  }

  // Gas APIs
  createGas(gasDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/gas`, gasDTO);
  }

  getGasById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/gas/${id}`);
  }

  getAllGases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gas`);
  }

  updateGas(id: number, gasDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/gas/${id}`, gasDTO);
  }

  deleteGas(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/gas/${id}`);
  }

  // Order APIs
  createOrder(orderDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderDTO);
  }


  createScheduleOrder(orderDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/schedule`, orderDTO);
  }

  sellRequestedOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/schedule/order`, { id: orderId });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${id}`);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }

  getAllRequestedOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/requested`);
  }

  getAllRequestedOutletOrdersByOutlet(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/requested/outlet`);
  }

  updateOrder(id: number, orderDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}`, orderDTO);
  }

  updateOrderStatus(id: number, orderDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/status/${id}`, orderDTO);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`);
  }

  // Order Gas APIs
  createOrderGas(orderGasDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ordergas`, orderGasDTO);
  }

  getOrderGasById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ordergas/${id}`);
  }

  getAllOrderGases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ordergas`);
  }

  updateOrderGas(id: number, orderGasDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ordergas/${id}`, orderGasDTO);
  }

  deleteOrderGas(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ordergas/${id}`);
  }

  // Outlet APIs
  createOutlet(outletDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/outlets`, outletDTO);
  }

  getAllOutlets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/outlets`);
  }

  getOutletById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/outlets/${id}`);
  }

  updateOutlet(id: number, outletDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/outlets/${id}`, outletDTO);
  }

  deleteOutlet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/outlets/${id}`);
  }
}
