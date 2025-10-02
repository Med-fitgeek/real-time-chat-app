import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-chat-sidebar-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-sidebar-component.html',
  styleUrl: './chat-sidebar-component.scss'
})
export class ChatSidebarComponent {
  @Input() users: string[] = [];
  @Output() selectConversation = new EventEmitter<string>();

    constructor(private authService: AuthService) {}

  selectedConversation: string = 'public';
  username: string = this.authService.getUsernameFromToken();
  avatarUrl: string = 'assets/default-avatar.png';

  select(conversation: string) {
    this.selectedConversation = conversation;
    this.selectConversation.emit(conversation);
  }
}
