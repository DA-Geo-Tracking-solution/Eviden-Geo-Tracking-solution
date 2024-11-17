import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheProjectComponent } from './about-the-project.component';

describe('AboutTheProjectComponent', () => {
  let component: AboutTheProjectComponent;
  let fixture: ComponentFixture<AboutTheProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutTheProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutTheProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
