import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatAlertComponent } from './add-chat-alert.component';

describe('AddChatAlertComponent', () => {
  let component: AddChatAlertComponent;
  let fixture: ComponentFixture<AddChatAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddChatAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddChatAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
