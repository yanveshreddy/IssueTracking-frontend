import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyIssuesComponent } from './my-issues/my-issues.component';
import { AllIssuesComponent } from './all-issues/all-issues.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { CreateIssueComponent } from './create-issue/create-issue.component';
//import { IssueHomeComponent } from './issue-home/issue-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppService } from '../app.service';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IssuerootComponent } from './issueroot/issueroot.component';
import { IssueRouteguardService } from './issue-routeguard.service';



@NgModule({
  declarations: [IssuerootComponent,MyIssuesComponent, AllIssuesComponent, IssueViewComponent, CreateIssueComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    RouterModule.forChild([

          { path: 'my-issues', component: MyIssuesComponent,canActivate:[IssueRouteguardService]},
          { path: 'all-issues', component: AllIssuesComponent, canActivate:[IssueRouteguardService]},
          { path: 'issue/:issueid', component: IssueViewComponent,canActivate:[IssueRouteguardService] },
          { path: 'create-issue', component: CreateIssueComponent,canActivate:[IssueRouteguardService] }
        
    ])
  ],
  providers: [AppService,IssueRouteguardService],
  bootstrap:[IssuerootComponent]

})
export class IssueModule { }
