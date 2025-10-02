import { Component, NgModule, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messages: { user: string, message: string }[] = [];
  currentMessage = '';
  currentUser = 'User'; // à récupérer depuis le token

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startConnection(localStorage.getItem("auth_token") || "");
    this.chatService.addReceiveMessageListener((user, message) => {
      this.messages.push({ user, message });
    });
  }

  sendMessage(): void {
    if (this.currentMessage.trim()) {
      this.chatService.sendMessage(this.currentUser, this.currentMessage);
      this.currentMessage = '';
    }
  }
}
