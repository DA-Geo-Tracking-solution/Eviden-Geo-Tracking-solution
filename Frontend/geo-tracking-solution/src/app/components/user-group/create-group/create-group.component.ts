import { Component } from '@angular/core';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { RestService } from '../../../services/REST/rest.service';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private formBuilder: FormBuilder, private restService: RestService, private cookieService:CookieSettingsService, private translateService:TranslateService ) {
    this.form = this.formBuilder.group({
      groupname:['', Validators.required], 
      groupmaster:['', Validators.required] 
    }, {updateOn: 'change'});

    this.translateService.use(this.cookieService.getLanguage());
   
  }

   get groupname() {return this.form.get('groupname');}
   get groupmaster(){return this.form.get('groupmaster');}


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

}
