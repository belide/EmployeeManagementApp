import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailValidatorDirective,
    multi: true
}]
})
export class EmailValidatorDirective implements Validator {

  @Input('appEmailValidator') emailDomain: string;
    validate(control: AbstractControl): { [key: string]: any } | null {
      let email = control.value; 
      console.log("email value in validator", this.emailDomain);
      if (email && email.indexOf("@") != -1) { 
        let [_, domain] = email.split("@"); 
        if (domain !== this.emailDomain) { 
          return {
            'emailDomainError': true
          }
        }
      }
      return null;
    }

}
