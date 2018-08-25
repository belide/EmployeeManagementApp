import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    groupName:any;
    listOfContacts = [];
    private gridApi;
    selectedRows:any;
    rowsSelected:any;
    selectedData:any;
    contactsFetched:any;
    private rowSelection;
    paginationPageSize = 10;
    stateButton:any;
    contactStatus:any;

    columnDefs = [
        {headerName: 'Employee Name', field: 'employeeName' },
        {headerName: 'Employee Id', field: 'employeeId' },
        {headerName: 'Email', field: 'email' },
        {headerName: 'Phone', field: 'phone', width:100 },
        {headerName: 'Aadhaar', field: 'aadhaar', width:100 },
        {headerName: 'Status', field: 'status'},
        {headerName: 'Created By', field: 'createdBy', hide: true},
        {headerName: 'In Group', field: 'inGroup', hide: true},
        {headerName: 'id', field: '_id', hide: true}
    ];

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
      private _router: Router) {
      this.fetchContacts();
      this.rowSelection = "single";
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  paginationNumberFormatter(params) {
    return "[" + params.value.toLocaleString() + "]";
  }

  onSelectionChanged() {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.rowsSelected = true;
    this.selectedData = this.selectedRows[0];
    this.stateButton = this.selectedData.status === "Active" ? "De Active" : "Active";
    this.contactStatus = this.stateButton === "Active" ? false : true;
  }


  changeState(){
    this.selectedData.status = this.selectedData.status === "Active"? "InActive" : "Active";
    this.stateButton = this.selectedData.status === "Active" ? "De Active" : "Active";
    this.contactStatus = this.stateButton === "Active" ? false : true;
    
    this.authService.updateContact(this.selectedData._id, this.selectedData).subscribe((contact)=>{
           this.fetchContacts();
           this.rowsSelected = false;
        },
        err => {
            console.log(err);
            return false;
        });
}

    fetchContacts(){
        this.contactsFetched = false;
        let username = this.authService.getLoggedInUser();
        let groupName = this.authService.getGroupName();
        let contactInfo = {"createdBy": username, "inGroup": groupName};
        this.authService.getContacts(contactInfo).subscribe((contacts)=>{
                this.listOfContacts = contacts;
                this.contactsFetched = true;
                console.log("contacts", this.listOfContacts);
            },
            err => {
                console.log(err);
                return false;
            });

    }
    editContact(){
      
      this._router.navigate(['/editcontact', this.selectedData._id]);
  }

  deleteContact(){
      
      this.authService.deleteContact(this.selectedData._id).subscribe(()=>{
             this.fetchContacts();
             this.rowsSelected = false;
          },
          err => {
              console.log(err);
              return false;
          });
  }
  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.paginationPageSize));
  }

  ngOnInit() {

  }

}
