import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumErrorMessageComponent } from './costum-error-message.component';

describe('CostumErrorMessageComponent', () => {
  let component: CostumErrorMessageComponent;
  let fixture: ComponentFixture<CostumErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostumErrorMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostumErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
