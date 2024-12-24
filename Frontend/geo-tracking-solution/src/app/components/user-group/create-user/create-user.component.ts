import { Component} from '@angular/core';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { RestService } from '../../../services/REST/rest.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { TranslateService } from '@ngx-translate/core';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {

  // * Icons:
  faEnvelope = faEnvelope;
  faUser = faUser;
  faExclamationTriangle = faExclamationTriangle;
  faKey = faKey;
  faCheck = faCheck;

  // * Form 
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private restService: RestService, private cookieService: CookieSettingsService, private translateService: TranslateService) {
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

  createUser(): void {  
    const user = this.form["value"]
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
