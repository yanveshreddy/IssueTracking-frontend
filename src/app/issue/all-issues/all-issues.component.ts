import { Component, OnInit } from '@angular/core';
//import { AgGridModule } from 'ag-grid-angular';
import { AppService} from '../../app.service'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import {TableModule} from 'primeng/table';
import { SelectItem } from 'primeng/components/common/selectitem';
//import { Row } from 'primeng/components/common/shared';

@Component({
  selector: 'app-all-issues',
  templateUrl: './all-issues.component.html',
  styleUrls: ['./all-issues.component.css']
})
export class AllIssuesComponent implements OnInit {

public allissues;

  rows:any[];
  cols: any[];

  statusvalues: SelectItem[];

  
 // colors: SelectItem[];

 // yearFilter: number;

  //yearTimeout: any;

  constructor(public appservice: AppService,private _route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

   // let authToken= Cookie.get('authToken');
    //console.log("AUTHTOKEN====="+authToken);
    this.appservice.allIssues().subscribe(

      data => {
        this.rows = data["data"];
        console.log("successs");
        console.log(this.rows);
      },
      error => {
       // console.log("Anvesh error");
        console.log(error.errormessage);
      }
    )

    this.cols = [
      {header: 'IssueID', field: 'issueId'},
      {header: 'Issue Title', field: 'title'},
      {header: 'Status', field: 'status'},
      {header: 'Reporter', field: 'reportername'},
     // {header: 'Date', field: 'created'}   
   ];

   this.statusvalues = [
    { label: 'All Status', value: null },
    { label: 'in- backlog', value: 'in- backlog' },
    { label: 'in- Progress', value: 'in- Progress' },
    { label: 'in- testing', value: 'in- testing' },
    { label: 'Done', value: 'Done' }
  ];

   
  }

  onRowSelect(event) {
   // let data=event.data;
  //  console.log(data);
    
    this.router.navigate(['/issue/'+event.data.issueId]);
    
}

}
