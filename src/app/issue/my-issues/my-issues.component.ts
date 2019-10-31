import { Component, OnInit } from '@angular/core';
//import { AgGridModule } from 'ag-grid-angular';
import { AppService} from '../../app.service'
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-my-issues',
  templateUrl: './my-issues.component.html',
  styleUrls: ['./my-issues.component.css']
})
export class MyIssuesComponent implements OnInit {

 // title = 'app';
 public myissues;
 columnDefs = [
  {headerName: 'Title', field: 'title', sortable: true, filter: true},
  {headerName: 'Status', field: 'status', sortable: true, filter: true},
  {headerName: 'Reporter', field: 'reporter', sortable: true, filter: true},
  {headerName: 'Date', field: 'date', sortable: true, filter: true}
];

  rowData :any;
  constructor(public appservice: AppService) { }

  ngOnInit() {

    let authToken= Cookie.get('authToken');
    //console.log("AUTHTOKEN====="+authToken);
    this.myissues = this.appservice.myIssues(authToken).subscribe(

      data => {
        this.myissues = data["data"];
        console.log("successs");
        console.log(this.myissues);
      },
      error => {
       // console.log("Anvesh error");
        console.log(error.errormessage);
      }
    )
  }

}
