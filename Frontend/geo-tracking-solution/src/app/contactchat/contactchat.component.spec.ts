import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactchatComponent } from './contactchat.component';

describe('ContactchatComponent', () => {
  let component: ContactchatComponent;
  let fixture: ComponentFixture<ContactchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactchatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
