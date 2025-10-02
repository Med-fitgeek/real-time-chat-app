import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PrivateMessage {
  from: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-private-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-private-component.html',
  styleUrls: ['./chat-private-component.scss']
})
export class ChatPrivateComponent implements OnInit {
  @Input() recipient!: string; // le destinataire choisi
  currentUser: string = localStorage.getItem('username') || 'me'; // exemple
  newMessage: string = '';
  messages: PrivateMessage[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Écoute des messages privés
    this.chatService.addReceivePrivateMessageListener((fromUser, message) => {
      if (fromUser === this.recipient || fromUser === this.currentUser) {
        this.messages.push({
          from: fromUser,
          content: message,
          timestamp: new Date()
        });
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.chatService.sendPrivateMessage(this.recipient, this.newMessage);

    // Ajouter le message dans l’historique local
    this.messages.push({
      from: this.currentUser,
      content: this.newMessage,
      timestamp: new Date()
    });

    this.newMessage = '';
  }
}
