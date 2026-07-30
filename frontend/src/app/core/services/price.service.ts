import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PriceUpdate {
  symbol: string;
  price: number;
  variation: number;
  timestamp: string;
}

export interface AlertTriggered {
  symbol: string;
  price: number;
  threshold: number;
}

export interface PricePoint {
  price: number;
  timestamp: string;
}

const HISTORY_MAX = 50; // points conservés par symbole

@Injectable({ providedIn: 'root' })
export class PriceService {
  private hubConnection!: signalR.HubConnection;

  public prices$  = new BehaviorSubject<Map<string, PriceUpdate>>(new Map());
  public alerts$  = new BehaviorSubject<AlertTriggered[]>([]);

  // Map<symbol, PricePoint[]> — buffer circulaire par actif
  public history$ = new BehaviorSubject<Map<string, PricePoint[]>>(new Map());

  public startConnection(token: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('[PriceService] SignalR connected'))
      .catch(err => console.error('[PriceService] Connection error:', err));

    this.hubConnection.on('PriceUpdate', (update: PriceUpdate) => {
      // --- prix courant ---
      const prices = new Map(this.prices$.value);
      prices.set(update.symbol, update);
      this.prices$.next(prices);

      // --- historique ---
      const history = new Map(this.history$.value);
      const points  = history.get(update.symbol) ?? [];
      const next    = [...points, { price: update.price, timestamp: update.timestamp }];
      history.set(update.symbol, next.length > HISTORY_MAX ? next.slice(-HISTORY_MAX) : next);
      this.history$.next(history);
    });

    this.hubConnection.on('AlertTriggered', (alert: AlertTriggered) => {
      this.alerts$.next([...this.alerts$.value, alert]);
    });
  }

  public setAlert(symbol: string, threshold: number, triggerAbove: boolean): void {
    this.hubConnection
      .invoke('SetAlert', symbol, threshold, triggerAbove)
      .catch(err => console.error('[PriceService] SetAlert error:', err));
  }

  public stopConnection(): void {
    this.hubConnection?.stop();
  }
}