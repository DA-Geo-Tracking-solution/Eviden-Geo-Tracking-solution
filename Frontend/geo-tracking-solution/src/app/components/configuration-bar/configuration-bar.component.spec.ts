import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationBarComponent } from './configuration-bar.component';

describe('ConfigurationBarComponent', () => {
  let component: ConfigurationBarComponent;
  let fixture: ComponentFixture<ConfigurationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
