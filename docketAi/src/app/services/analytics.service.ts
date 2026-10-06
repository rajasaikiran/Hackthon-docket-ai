import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AgencyAnalytics,
  CarrierAnalytics,
  DashboardSummary,
  ProducerAnalytics,
  QueryResponse,
  TaskAnalytics
} from '../models/analytics.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/analytics`;

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard`);
  }

  getAgencies(): Observable<AgencyAnalytics> {
    return this.http.get<AgencyAnalytics>(`${this.baseUrl}/agencies`);
  }

  getCarriers(): Observable<CarrierAnalytics> {
    return this.http.get<CarrierAnalytics>(`${this.baseUrl}/carriers`);
  }

  getProducers(): Observable<ProducerAnalytics> {
    return this.http.get<ProducerAnalytics>(`${this.baseUrl}/producers`);
  }

  getTasks(): Observable<TaskAnalytics> {
    return this.http.get<TaskAnalytics>(`${this.baseUrl}/tasks`);
  }

  query(prompt: string): Observable<QueryResponse> {
    return this.http.post<QueryResponse>(`${environment.apiBaseUrl}/query`, { prompt });
  }
}
