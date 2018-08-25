import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-createcontact',
  templateUrl: './createcontact.component.html',
  styleUrls: ['./createcontact.component.css']
})
export class CreatecontactComponent implements OnInit {

@ViewChild('createContactForm') form:any;

    contactData = {
        employeeName: null,
        employeeId: null,
        email: null,
        phone: null,
        aadhaar:null,
        inGroup: null,
        createdBy: null,
        status:null
    };
    title = "Add Contact To Group - ";
    submitText = "Add Contact"
    contactId:any;
    groupName:any;   

    constructor(private authService: AuthService,
                private _route: ActivatedRoute,
                private _router: Router) {
                this.groupName = this.authService.getGroupName();
    }

    ngOnInit() {
        this._route.paramMap.subscribe(parameterMap => {
            this.contactId = parameterMap.get('id');
            this.getContact(this.contactId);
        });
    }

    getContact(contactId){
        if(!contactId){
            this.contactData = {
                employeeName:null,
                employeeId: null,
                email: null,
                phone: null,
                aadhaar:null,
                inGroup: null,
                createdBy: null,
                status: null
            }
        }
        else{
            this.title = "Update Contact to Group - ";
            this.submitText = "Update Contact";
            this.groupName = this.authService.getGroupName();
            let contactInfo = {};
            contactInfo["contactId"] = contactId;
            this.authService.getContactById(contactInfo).subscribe((contact) => {
                console.log("feteched contact", contact);
                this.contactData = contact;
            });
        }
    }

    createContact(){
        this.contactData.createdBy = this.authService.getLoggedInUser();
        this.contactData.inGroup = this.authService.getGroupName();
        this.contactData.status = "Active";
        console.log(this.authService.getGroupName());
        if(this.contactId){
            this.authService.updateContact(this.contactId,this.contactData).subscribe((contact)=>{
                console.log("updatedGroup", contact);
                this._router.navigate(['/contacts']);
            });
        }
        else{
            this.authService.createContact(this.contactData).subscribe((contact)=>{
                    console.log("received created contact", contact);
                    this._router.navigate(['/contacts']);
                },
                err => {
                    console.log(err);
                    return false;
                });
        }
    }
}
