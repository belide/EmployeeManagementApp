import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {

  firstName: String;
  lastName: String;
  email:String;
  password: String;
  aadhaar: String;
  emailDomain:String = "inmar.com";
  orgDomain:String;
  orgExtn:String;

  constructor(private authService: AuthService,
    private _router:Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  checkDomain(){
    console.log("on focus out", this.emailDomain);
    if(this.emailDomain === ""){
      this.emailDomain = "inmar.com";
    }
    let mailSplit = this.emailDomain.split('.');
    this.orgDomain = mailSplit[0];
    this.orgExtn = mailSplit[1];
  }

  onRegisterSubmit(){
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      aadhaar: this.aadhaar
    }
    // Register user
    this.authService.registerUser(user).subscribe(data => {
      console.log("received data", data);
      if(data.success === false) {
        console.log("received data in if", data);
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
      }
      else{
      console.log("received data in else", data);
      this._router.navigate(['/login']);
      this.flashMessage.show('You are now registered!', {cssClass: 'alert-success', timeout: 5000});    
      
      }
    });
  }

}
