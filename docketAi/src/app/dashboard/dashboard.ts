import { Component, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AnalyticsService } from '../services/analytics.service';
import {
  AgencyAnalytics,
  CarrierAnalytics,
  DashboardSummary,
  ProducerAnalytics,
  TaskAnalytics
} from '../models/analytics.models';

@Component({
  selector: 'app-dashboard',
  imports: [KeyValuePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly analytics = inject(AnalyticsService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly summary = signal<DashboardSummary | null>(null);
  protected readonly agencies = signal<AgencyAnalytics | null>(null);
  protected readonly carriers = signal<CarrierAnalytics | null>(null);
  protected readonly producers = signal<ProducerAnalytics | null>(null);
  protected readonly tasks = signal<TaskAnalytics | null>(null);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      summary: this.analytics.getDashboard(),
      agencies: this.analytics.getAgencies(),
      carriers: this.analytics.getCarriers(),
      producers: this.analytics.getProducers(),
      tasks: this.analytics.getTasks()
    }).subscribe({
      next: (r) => {
        this.summary.set(r.summary);
        this.agencies.set(r.agencies);
        this.carriers.set(r.carriers);
        this.producers.set(r.producers);
        this.tasks.set(r.tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load analytics. Is the API running on localhost:8080?');
        this.loading.set(false);
      }
    });
  }

  protected pct(value: number, map: Record<string, number>): number {
    const max = Math.max(1, ...Object.values(map));
    return (value / max) * 100;
  }

  protected maxDaily(): number {
    return Math.max(1, ...(this.tasks()?.dailyCompletionTrend ?? []).map((d) => d.count));
  }
}
