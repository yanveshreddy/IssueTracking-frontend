import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ROUTES,RouterModule} from '@angular/router'
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {ToastrModule} from 'ngx-toastr';
import { LoginComponent } from './user/login/login.component';
import { IssueModule } from './issue/issue.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    UserModule,
    IssueModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path:'login',component:LoginComponent,pathMatch:'full'},
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path:'*',component:LoginComponent},
      {path:'**',component:LoginComponent}
  ]),
    BrowserAnimationsModule,
],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
