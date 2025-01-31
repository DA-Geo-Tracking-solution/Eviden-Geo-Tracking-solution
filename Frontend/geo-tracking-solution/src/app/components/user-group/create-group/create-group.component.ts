import { Component } from '@angular/core';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { RestService } from '../../../services/REST/rest.service';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessAlertComponent } from '../../settings/success-alert/success-alert.component';
import { debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent {

  // * Icons:
  faEnvelope = faEnvelope;
  faUser = faUser;
  faExclamationTriangle = faExclamationTriangle;
  faCheck = faCheck;

  form: FormGroup;
  users: any[] = [];
  userControls: FormControl[] = [];
  filteredUsers: any[][] = [];
  selectedUsers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private restService: RestService,
    private cookieService: CookieSettingsService,
    private translateService: TranslateService,
    private matDialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      groupname: ['', Validators.required],
      groupmasteremail: ['', [Validators.required, Validators.email]]
    });

    this.translateService.use(this.cookieService.getLanguage());
    this.addUserField();
  }

  addUserField(): void {
    const control = new FormControl('');
    this.users.push({});
    this.userControls.push(control);
    this.filteredUsers.push([]);
  }

  onUserSearch(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || !inputElement.value) {
      this.filteredUsers[index] = [];
      return;
    }
    const query = inputElement.value;
    this.restService.GET(`member/group-members?query=${query}`)
      .then(observable => {
        observable.subscribe({
          next: (users: any[]) => {
            this.filteredUsers[index] = users;
          },
          error: () => this.filteredUsers[index] = []
        });
      })
      .catch(() => this.filteredUsers[index] = []);
  }

  onSelectUser(user: any, index: number): void {
    this.users[index] = user;
    this.filteredUsers[index] = [];
  }

  createSubGroup(): void {
    this.restService.POST("groupmaster/subgroup", {
      name: this.form.value.groupname,
      groupmasterEmail: this.form.value.groupmasteremail
    }).then(observable => {
      observable.subscribe({
        next: () => this.openDialog(),
        error: (err) => console.error("Error:", err)
      });
    });
  }

  openDialog(): void {
    this.matDialog.open(SuccessAlertComponent, {
      width: '50%',
      data: { message: 'Group created successfully!' }
    });
  }
}
