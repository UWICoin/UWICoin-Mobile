import { AbstractControl } from '@angular/forms';


export function passwordMatchValidator(ac: AbstractControl) {

    let password = ac.root.get('password') ? ac.root.get('password').value : null;
    let confirmPassword = ac.value;

    if (!password) {
        return { 'passwordNotSet': true };
    }
    return confirmPassword == password ? null : { 'mismatch': true };
}