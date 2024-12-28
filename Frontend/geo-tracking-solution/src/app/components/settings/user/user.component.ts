import { Component } from '@angular/core';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../services/Theme/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { RestService } from '../../../services/REST/rest.service';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { UserInformation } from '../../../models/interfaces';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  backgroundImage: string = '';

  faEnvelope = faEnvelope;
  faUser = faUser;
  faExclamationTriangle = faExclamationTriangle;
  faKey = faKey;
  faCheck = faCheck;


  form: FormGroup;

  constructor(private keycloakService: KeycloakService, private cookieService: CookieSettingsService, private translateService: TranslateService,private formBuilder: FormBuilder, private restService: RestService) {
    this.translateService.use(this.cookieService.getLanguage());

    const user = keycloakService.user;
    this.form = this.formBuilder.group({
      firstname: [user?.given_name || ''],
      lastname: [user?.family_name ||''],
      username: [user?.preferred_username ||'', Validators.required],
      email: [user?.email ||'', [Validators.required, Validators.email]],
      password: [user?.email ||'', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]]
    }, { updateOn: 'change' });
  }


  updateUser() {
    const user = this.form["value"];
    this.restService.POST("groupmaster/user", {
      "user": {
        "username": user["username"],
        "userEmail": user["email"],
        "firstname": user["firstname"],
        "lastname": user["lastname"]
      },
      "temporaryPassword": user["password"]
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

}


 /* isAlertVisible = false;


  constructor(private formBuilder: FormBuilder, private restService: RestService, private cookieService: CookieSettingsService, private translateService: TranslateService, public matDialog: MatDialog) {
    this.form = this.formBuilder.group({
      firstname: [''], // Hinzugefügt
      lastname: [''], // Hinzugefügt
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]]
    }, { updateOn: 'change' });
    this.translateService.use(this.cookieService.getLanguage());
  }

  // Getter
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }


  openDialog() {
    const dialogRef = this.matDialog.open(SuccessAlertComponent, {
      width: '50%',
    });
  }

  showAlert() {
    this.isAlertVisible = true;
  }*/


