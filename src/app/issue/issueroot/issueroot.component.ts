import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-issueroot',
  templateUrl: './issueroot.component.html',
  styleUrls: ['./issueroot.component.css']
})
export class IssuerootComponent implements OnInit {

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute, 
     private router: Router,
     
    public toastr: ToastrService
    ) { }

  ngOnInit() {

  }
  
 }