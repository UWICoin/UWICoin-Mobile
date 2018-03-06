import { FormControl, AbstractControl } from '@angular/forms';


// Ensures that the email contains the domain 'my.uwi.edu'
// Returns null if the email contains the domain and an error if not
export function emailDomainValidator(ac: AbstractControl) {
  let email = ac.value;
  if (email && email.indexOf('@') != -1) {
    let [_, domain] = email.split('@');
    if (domain == 'my.uwi.edu') {
      return null;
    }
  }
  return { 'invalid': true };
}


// Ensures that the email contains the sequence of strings, firstName.lastName at the beginning
// Returns null if part of the email matches the full name and an error if not
export function emailMatchValidator(ac: AbstractControl) {
  let email = ac.value;
  let fullName = ac.root.get('fullName') ? ac.root.get('fullName').value : null;
  if(!fullName) {
    return { noName: 'true' };
  }
  let [firstName, lastName] = fullName.split(' ');
  let requiredName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  if(email && email.indexOf(requiredName) != 0) {
    return { mismatch: true };
  }
  return null;
}