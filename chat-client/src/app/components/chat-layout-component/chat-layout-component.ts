import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatPrivateComponent} from '../chat-private-component/chat-private-component';
import { ChatSidebarComponent } from "../chat-sidebar-component/chat-sidebar-component";
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: 'app-chat-layout-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatPrivateComponent, ChatSidebarComponent, ChatComponent],
  templateUrl: './chat-layout-component.html',
  styleUrls: ['./chat-layout-component.scss']
})
export class ChatLayoutComponent {
  connectedUsers: string[] = ['test', 'test2', 'charlie']; // viendra du hub plus tard
  currentConversation: string = 'public'; // public par défaut

  onSelectConversation(conversation: string) {
    this.currentConversation = conversation;
  }
}
