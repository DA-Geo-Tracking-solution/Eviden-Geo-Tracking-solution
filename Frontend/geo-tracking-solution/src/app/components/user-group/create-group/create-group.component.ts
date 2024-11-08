import { Component } from '@angular/core';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

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

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      groupname:['', Validators.required], 
      groupmaster:['', Validators.required] 
    }, {updateOn: 'change'});
   }

   get groupname() {return this.form.get('groupname');}
   get groupmaster(){return this.form.get('groupmaster');}

}
