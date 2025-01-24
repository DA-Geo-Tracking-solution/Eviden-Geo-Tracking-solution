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
  faKey = faKey;
  faCheck = faCheck;

  // * Form 
  form: FormGroup;
  userControls: FormControl[] = [];
  filteredUsers: any[] = [];
  users: any[] = [];
  selectedUsers: any[] = [];

  constructor(private formBuilder: FormBuilder, private restService: RestService, private cookieService: CookieSettingsService, private translateService: TranslateService, private matDialog: MatDialog) {

    this.form = this.formBuilder.group({
      groupname: ['', Validators.required],
      groupmaster: ['', Validators.required],
      searchUsers: ['']
    }, { updateOn: 'change' });

    this.translateService.use(this.cookieService.getLanguage());

    // TODO: Einer der Beiden muss es sein
    this.addUserField();
    this.addUserInput();
  }

  addUserInput(): void {
    const control = new FormControl();
    this.userControls.push(control);
    this.filteredUsers.push([]);

    // Live-Suche für das neue Feld einrichten
    control.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((query: string) => {
          if (!query) return of([]);
          return from(this.restService.GET(`member/group-members?query=${query}`)).pipe(
            switchMap(observable => observable.pipe(
              map((response: any[]) => response),
              catchError(() => of([]))
            ))
          );
        })
      )
      .subscribe(users => {
        const index = this.userControls.indexOf(control);
        if (index !== -1) {
          this.filteredUsers[index] = users;
        }
      });
  }

  get groupname() { return this.form.get('groupname'); }
  get groupmaster() { return this.form.get('groupmaster'); }


  createSubGroup(): void {
    const user = this.form["value"]
    this.restService.POST("groupmaster/subgroup", {
      name: this.groupname,
      groupmasterEmail: this.groupmaster
    }).then(observable => {
      observable.subscribe({
        next: (line) => {
          console.log(line)
        },
        error: (err) => {
          console.error("Error in Observable:", err);
        },
        complete: () => {
          console.log("Observable completed");
        },
      });
    }).catch(err => {
      console.error("Error resolving promise:", err);
    });
  }

  openDialog() {
    const dialogRef = this.matDialog.open(SuccessAlertComponent, {
      width: '50%',
      data: { message: 'Group created successfully!' }
    });
  }

  addUserToGroup(user: any): void {
    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
    }
    this.filteredUsers = [];
    this.form.get('searchUsers')?.reset();
  }

  removeUserFromGroup(user: any): void {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
  }

  /**
   * Wird aufgerufen, wenn ein Nutzer aus den Vorschlägen ausgewählt wird.
   */
  addUserToSelected(user: any, index: number): void {
    if (!this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers.push(user);
    }

    // Dropdown schließen und das Input-Feld zurücksetzen
    this.filteredUsers[index] = [];
    this.userControls[index].reset();
  }

  /**
   * Entfernt einen Nutzer aus der ausgewählten Liste.
   */
  removeUserFromSelected(user: any): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  }

  // Search for users based on input
  onUserSearch(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement | null; // Cast und mögliche Nullwerte beachten
  
    if (!inputElement || !inputElement.value) {
      this.filteredUsers[index] = []; // Wenn das Element oder der Wert fehlt, Vorschläge leeren
      return;
    }
  
    const query = inputElement.value;
  
    this.restService.GET(`member/group-members?query=${query}`)
      .then(observable => {
        observable.subscribe({
          next: (users: any[]) => {
            this.filteredUsers[index] = users; // Vorschläge aktualisieren
          },
          error: (err) => {
            console.error('Fehler beim Abrufen der Nutzer:', err);
            this.filteredUsers[index] = []; // Vorschläge bei Fehler löschen
          }
        });
      })
      .catch(err => {
        console.error('Fehler in der Promise:', err);
        this.filteredUsers[index] = []; // Vorschläge bei Fehler löschen
      });
  }
  


  addUserField(): void {
    this.users.push({});
    this.filteredUsers.push([]);
  }

  onSelectUser(user: any, index: number): void {
    this.users[index] = user;
    this.filteredUsers[index] = [];
  }

}
