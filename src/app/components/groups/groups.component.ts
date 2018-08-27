import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
    contactGroups = [];
    private gridApi;
    selectedRows:any;
    rowsSelected:any;
    selectedData:any;
    groupsFetched:any;
    private rowSelection;
    paginationPageSize = 10;
    stateButton:any;
    groupStatus:any;

    columnDefs = [
        {headerName: 'Group Name', field: 'groupName', width: 400 },
        {headerName: 'Group Description', field: 'groupDescription', width: 400 },
        {headerName: 'Status', field: 'status', width: 200},
        {headerName: 'Created By', field: 'createdBy', hide: true},
        {headerName: 'id', field: '_id', hide: true}
    ];
   

  constructor(private authService: AuthService,
              private _router: Router) {
      
      this.fetchGroups();
      this.rowSelection = "single";      
  }

  paginationNumberFormatter(params) {
    return "[" + params.value.toLocaleString() + "]";
  }
  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.paginationPageSize));
  }
  ngOnInit() {

      console.log("in init");

  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.rowsSelected = true;
    this.selectedData = this.selectedRows[0];
    this.stateButton = this.selectedData.status === "Active" ? "De Active" : "Active";
    this.groupStatus = this.stateButton === "Active" ? false : true;
    
  }


    fetchGroups(){
        this.groupsFetched = false;
        let username = this.authService.getLoggedInUser();
        let groupInfo = {"createdBy": username};
        this.authService.getGroups(groupInfo).subscribe((groups)=>{
            this.groupsFetched = true;
                this.contactGroups = groups;
            },
            err => {
                console.log(err);
                return false;
            });

    }

    editGroupInfo(){        
        this._router.navigate(['/editgroup', this.selectedData._id]);
    }

    deleteGroup(){
        
        this.authService.deleteGroup(this.selectedData._id).subscribe((group)=>{
               this.fetchGroups();
               this.rowsSelected = false;
            },
            err => {
                console.log(err);
                return false;
            });
    }

    changeState(){
        this.selectedData.status = this.selectedData.status === "Active"? "InActive" : "Active";
        this.stateButton = this.selectedData.status === "Active" ? "De Active" : "Active";
        this.groupStatus = this.stateButton === "Active" ? false : true;
        
        this.authService.updateGroup(this.selectedData._id, this.selectedData).subscribe((group)=>{
               this.fetchGroups();
               this.rowsSelected = false;
            },
            err => {
                console.log(err);
                return false;
            });
    }

    fetchContacts(){
        this.authService.saveGroupName(this.selectedData.groupName);
        this._router.navigate(['/contacts']);
        console.log(this.authService.getGroupName());
    }
}
