import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationDTO } from '../model/notification.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  createNotification(notification: NotificationDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, notification);
  }

  getAllNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(this.apiUrl);
  }

  loadNotifications(): void {
    this.getAllNotifications().subscribe({
      next: (notifications) => {
        const notificationsWithReadStatus = notifications.map(n => ({
          ...n,
          isRead: false
        }));
        this.notificationsSubject.next(notificationsWithReadStatus);
      },
      error: (error) => console.error('Error loading notifications:', error)
    });
  }

  markAsRead(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  removeNotificationFromList(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }
}
