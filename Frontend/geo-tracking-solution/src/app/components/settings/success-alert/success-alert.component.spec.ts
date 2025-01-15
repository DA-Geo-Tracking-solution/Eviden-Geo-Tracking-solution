import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessAlertComponent } from './success-alert.component';
import { By } from '@angular/platform-browser';

describe('SuccessAlertComponent', () => {
  let component: SuccessAlertComponent;
  let fixture: ComponentFixture<SuccessAlertComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const dialogData = {
    message: 'Test success message'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessAlertComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the success message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(dialogData.message);
  });

  it('should call dialogRef.close when close method is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('button.close-button'));
    closeButton.triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
