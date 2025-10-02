import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;

  public startConnection(token?: string): void {
    if (token == null)
      throw "token introuvable"
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5099/chatHub', {
        accessTokenFactory: () => token // 🔑 le token JWT
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('[SignalR] Connexion établie'))
      .catch(err => console.error('[SignalR] Erreur de connexion', err));
  }

  // ----- Messagerie publique -----
  public addReceiveMessageListener(callback: (user: string, message: string) => void): void {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  public sendMessage(user: string, message: string): void {
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error('[SignalR] Erreur envoi message public', err));
  }

  // ----- Messagerie privée -----
  public addReceivePrivateMessageListener(callback: (fromUser: string, message: string) => void): void {
    this.hubConnection.on('ReceivePrivateMessage', callback);
  }

  public sendPrivateMessage(toUser: string, message: string): void {
    this.hubConnection.invoke('SendPrivateMessage', toUser, message)
      .catch(err => console.error('[SignalR] Erreur envoi message privé', err));
  }
}
