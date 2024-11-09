import { Component} from '@angular/core';
import { faCheck, faUser, faEnvelope, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

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

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstname: [''], // Hinzugefügt
      lastname: [''], // Hinzugefügt
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]]
    }, { updateOn: 'change' });
  }

  // Getter
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

}
