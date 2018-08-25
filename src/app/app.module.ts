import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { LoginComponent } from './components/login/login.component';
import { GroupsComponent } from './components/groups/groups.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './modules/routing/routing.module';
import { RouterModule, Routes } from '@angular/router';

import { FlashMessagesModule } from 'angular2-flash-messages';
import { CreategroupComponent } from './components/creategroup/creategroup.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CreatecontactComponent } from './components/createcontact/createcontact.component';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import { AuthGuard } from './guards/auth.guard';
import { AgGridModule } from 'ag-grid-angular';


const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterEmployeeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'groups', component: GroupsComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  { path: 'creategroup', component: CreategroupComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  { path: 'editgroup/:id', component: CreategroupComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  { path: 'contacts', component: ContactsComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  { path: 'createcontact', component: CreatecontactComponent, pathMatch: 'full',canActivate:[AuthGuard]},
  { path: 'editcontact/:id', component: CreatecontactComponent, pathMatch: 'full',canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterEmployeeComponent,
    LoginComponent,
    GroupsComponent,
    NavbarComponent,
    CreategroupComponent,
    ContactsComponent,
    CreatecontactComponent,
    EmailValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    AgGridModule.withComponents([])
  ],

  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
