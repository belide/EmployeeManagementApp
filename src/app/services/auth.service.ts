import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  groupName:any;
  helper = new JwtHelperService();

  constructor(private http:HttpClient) { }
  //Register User
  registerUser(user): Observable<any>{    
    return this.http.post("http://localhost:8080/register",user,{
      headers: new HttpHeaders({
        'content-type':'application/json'
      })
    })
  }
  //Authenticate User
  authenticateUser(user): Observable<any>{    
    return this.http.post("http://localhost:8080/authenticate",user,{
      headers: new HttpHeaders({
        'content-type':'application/json'
      })
    })
  }
  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
  getLeavesList(empId): Observable<any> {
    console.log("request received in auth service");
    this.loadToken();
    return this.http.post('http://localhost:8080/getLeavesList', empId,{
      headers: new HttpHeaders({
        'content-type':'application/json',
        'Authorization':this.authToken
      })

    })
  }
  //Create Group
  createGroup(groupData): Observable<any> {
    console.log("create group request", groupData);
    this.loadToken();
    return this.http.post('http://localhost:8080/creategroup', groupData,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })

    })
}

getGroupById(groupIdInfo): Observable<any>{
    return this.http.post("http://localhost:8080/getGroupById",groupIdInfo,{
        headers: new HttpHeaders({
            'content-type':'application/json'
        })
    })
}

getLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.email;
}
getGroups(groupInfo): Observable<any>{
    console.log("getGroups", groupInfo);
    this.loadToken();
    return this.http.post("http://localhost:8080/getGroups",groupInfo,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })
    })
}

updateGroup(id,groupInfo): Observable<any>{
    console.log("post request from application", groupInfo);
    let updatedGroupDetails = {};
    updatedGroupDetails["groupId"] = id;
    updatedGroupDetails["group"] = groupInfo;
    return this.http.put("http://localhost:8080/updateGroup",updatedGroupDetails,{
        headers: new HttpHeaders({
            'content-type':'application/json'
        })
    })
}

deleteGroup(id): Observable<any>{
    console.log("post request from application", id);
    let groupId = {};
    groupId["groupId"] = id;
    return this.http.post("http://localhost:8080/deleteGroup",groupId,{
        headers: new HttpHeaders({
            'content-type':'application/json'
        })
    })
}

saveGroupName(groupName){
    this.groupName = groupName;
}
getGroupName(){
    return this.groupName;
}

createContact(contactData): Observable<any> {
    console.log("create contactData request", contactData);
    this.loadToken();
    return this.http.post('http://localhost:8080/createContact', contactData,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })

    })
}

getContacts(contactInfo): Observable<any>{
    this.loadToken();
    return this.http.post("http://localhost:8080/getContacts",contactInfo,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })
    })
}
updateContact(id,contactInfo): Observable<any>{
    console.log("post request from application", contactInfo);
    this.loadToken();
    let updatedContactDetails = {};
    updatedContactDetails["contactId"] = id;
    updatedContactDetails["contact"] = contactInfo;
    return this.http.put("http://localhost:8080/updateContact",updatedContactDetails,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })
    })
}

deleteContact(id): Observable<any>{
    console.log("post request from application", id);
    this.loadToken();
    let contactInfo = {};
    contactInfo["contactId"] = id;
    return this.http.post("http://localhost:8080/deleteContact",contactInfo,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })
    })
}

getContactById(contactInfo): Observable<any>{
    this.loadToken();
    console.log("sending contactbyid request");
    return this.http.post("http://localhost:8080/getContactById",contactInfo,{
        headers: new HttpHeaders({
            'content-type':'application/json',
            'Authorization':this.authToken
        })
    })
}

//end
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  loggedIn() {
    const token = localStorage.getItem('token');
   return (token!==null && !this.helper.isTokenExpired(token));
  }
}