import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactChatComponent } from './contact-chat.component';

describe('ContactChatComponent', () => {
  let component: ContactChatComponent;
  let fixture: ComponentFixture<ContactChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
