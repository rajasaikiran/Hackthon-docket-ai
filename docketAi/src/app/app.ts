import { Component, inject, signal } from '@angular/core';
import { AnalyticsService } from './services/analytics.service';
import { ChatMessage } from './chat-types';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('docketAi');
  protected readonly userInput = signal('');
  protected readonly onDashboard = signal(false);

  private readonly analytics = inject(AnalyticsService);
  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly sending = signal(false);
  protected readonly recents = signal<string[]>(this.loadRecents());

  private loadRecents(): string[] {
    try {
      return JSON.parse(globalThis.localStorage?.getItem('recentPrompts') ?? '[]');
    } catch {
      return [];
    }
  }

  private addRecent(prompt: string): void {
    const next = [prompt, ...this.recents().filter((p) => p !== prompt)].slice(0, 10);
    this.recents.set(next);
    globalThis.localStorage?.setItem('recentPrompts', JSON.stringify(next));
  }

  protected send(): void {
    const prompt = this.userInput().trim();
    if (!prompt || this.sending()) return;
    this.messages.update((m) => [...m, { role: 'user', text: prompt }]);
    this.addRecent(prompt);
    this.userInput.set('');
    this.sending.set(true);
    this.analytics.query(prompt).subscribe({
      next: (res) => {
        const rows = res.data ?? [];
        const columns = rows.length ? Object.keys(rows[0]) : [];
        const text = res.success
          ? `${rows.length} result(s) in ${res.executionTimeMs} ms`
          : res.message;
        this.messages.update((m) => [...m, { role: 'assistant', text, columns, rows, error: !res.success }]);
        this.sending.set(false);
      },
      error: (err) => {
        const text = err?.error?.message ?? 'Request failed. Is the API running on localhost:8080?';
        this.messages.update((m) => [...m, { role: 'assistant', text, error: true }]);
        this.sending.set(false);
      }
    });
  }

  protected cell(v: unknown): string {
    return v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
  }

  constructor() {
    inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.onDashboard.set(e.urlAfterRedirects.startsWith('/dashboard'));
      }
    });
  }
}
