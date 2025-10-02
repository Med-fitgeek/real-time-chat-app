import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPrivateComponent } from './chat-private-component';

describe('ChatPrivateComponentComponent', () => {
  let component: ChatPrivateComponent;
  let fixture: ComponentFixture<ChatPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPrivateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
