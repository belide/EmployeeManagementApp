import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrls: ['./creategroup.component.css']
})
export class CreategroupComponent implements OnInit {

@ViewChild('createGroupForm') form:any;
    groupData = {
    groupName:null,
    groupDescription: null,
    createdBy: null,
    status:null
};
    title = "Create Group";
    groupId:any;

  constructor(private authService: AuthService,
              private _route: ActivatedRoute,
              private _router: Router) {

  }

  ngOnInit() {

      this._route.paramMap.subscribe(parameterMap => {
          this.groupId = parameterMap.get('id');
          this.getGroup(this.groupId);
      });
  }

    getGroup(groupId){
        if(!groupId){
            this.groupData = {
                groupName:null,
                groupDescription: null,
                createdBy: null,
                status: null
            }
        }
        else{
            this.title = "Update Group";
            let groupInfo = {};
            groupInfo["groupId"] = groupId;
            this.authService.getGroupById(groupInfo).subscribe((group) => {
                console.log("feteched group", group);
                this.groupData = group;
            });
        }
    }

    createGroup(){
        this.groupData.createdBy = this.authService.getLoggedInUser();
        this.groupData.status = "Active";
        if(this.groupId){
            this.authService.updateGroup(this.groupId,this.groupData).subscribe((group)=>{
                console.log("updatedGroup", group);
                this._router.navigate(['/groups']);
            });
        }
        else{
            console.log("before", this.groupData);
        this.authService.createGroup(this.groupData).subscribe((group)=>{
                console.log(" received created group", group);
                this._router.navigate(['/groups']);
            },
            err => {
                console.log(err);
                return false;
            });
        }
    }

}
