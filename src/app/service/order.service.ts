import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { OrderSummaryDTO } from '../model/order-summary.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService { // changed from GasCollectService to OrderService
  private baseUrl = 'http://localhost:8080/api';
  private apiUrl = 'http://localhost:8080/api/orderSummary';
  constructor(private http: HttpClient) {}

  // Delivery Schedule APIs
  addDeliverySchedule(deliveryCompletionDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/delieveryShedule`, deliveryCompletionDTO);
  }

  getLastOrderId(): Observable<number | string> {
    return this.http.get<number | string>(`${this.baseUrl}/orders/last-id`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getOrdersByUserId(userId: number): Observable<OrderSummaryDTO[]> {
    return this.http.get<OrderSummaryDTO[]>(`${this.apiUrl}/user/${userId}`);
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

  getOrderDetailsById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/details/${id}`);
  }

  getToken(orderId: number): Observable<any> {
    return this.getOrderById(orderId);
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
    console.log(`Updating order id: ${id} with outlet id: ${orderDTO.outletId}`);
    this.getOutletDetailsById(orderDTO.outletId).subscribe(outletDetails => {
      console.log(`Outlet details for id ${orderDTO.outletId}:`, outletDetails);
      // ...existing code...
    });
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


  createOutlet(outletDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/outlets`, outletDTO);
  }


  getAllOutlets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/outlets`);
  }

  getOutletById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/outlets/${id}`);
  }

  getOutletDetailsById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/outlets/${id}`).pipe(
      map((outlet: any) => ({
        name: outlet.name,
        address: outlet.address,
        contactDetails: outlet.contactDetails
      }))
    );
  }

  updateOutlet(id: number, outletDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/outlets/${id}`, outletDTO);
  }

  deleteOutlet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/outlets/${id}`);
  }


  createOrderSummary(order: OrderSummaryDTO): Observable<OrderSummaryDTO> {
    return this.http.post<OrderSummaryDTO>(`${this.apiUrl}`, order)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get all orders
  getAllOrderSummary(): Observable<OrderSummaryDTO[]> {
    return this.http.get<OrderSummaryDTO[]>(`${this.apiUrl}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get order by ID
  getOrderSummaryById(id: number): Observable<OrderSummaryDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<OrderSummaryDTO>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Search orders by customer name
  searchOrders(customerName: string): Observable<OrderSummaryDTO[]> {
    const url = `${this.apiUrl}/search?customerName=${customerName}`;
    return this.http.get<OrderSummaryDTO[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete order by ID
  deleteOrderSummary(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        mapTo(void 0),
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
