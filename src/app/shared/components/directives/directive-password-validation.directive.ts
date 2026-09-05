import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

export function passwordValidation(): ValidatorFn {
  return (control: AbstractControl) => {
    const passwordValidationDirective = new DirectivePasswordValidationDirective();
    return passwordValidationDirective.validate(control);
  }
 }


@Directive({
  selector: '[appDirectivePasswordValidation]',
  standalone: true
}) 
export class DirectivePasswordValidationDirective {


  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors | null{
    const password = <string>control.value;

    if (!password) {return{'passwordValidation': {'message': 'Debe ingresar una contraseña'}};}
    if (password.length < 4) {return {'passwordValidation': {'message': 'La contraseña debe contener más de 4 caracteres'}} ;}

    if (password === password.toLowerCase()){
      return {'passwordValidation': {'message': 'La contraseña debe contener mayúsculas'}}
    }
 
    if (password === password.toUpperCase()){
      return {'passwordValidation': {'message': 'La contraseña debe contener minúsculas'}}
    }
 
    if (!/\d/.test(password)){
      return {'passwordValidation': {'message': 'La contraseña debe incluir un caracter numérico'}}
    }
    
    return null;

}
}