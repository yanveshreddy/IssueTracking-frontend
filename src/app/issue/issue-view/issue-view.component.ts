import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {Location} from '@angular/common';
import { FormControl } from '@angular/forms';
//import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css'],
  providers:[Location]
})
export class IssueViewComponent implements OnInit {

  public currentIssue;
  public currentIssueId;

  public statuslist = ["in- progress", "in- backlog", "in- testing", "Done"];

  users=[];
  userId:any;
  name:string;

  public issueComment;
  public selectedAssignee=[];

  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "0",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
      ["fontName", "fontSize", "color"],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link", "unlink"]
    ]
  }

  assigneeControl=new FormControl();
  constructor(public appService: AppService, private _route: ActivatedRoute, private router: Router, public toastr: ToastrService,public snackBar:MatSnackBar,private location:Location) { }

  ngOnInit() {

    this.userId = this.appService.getUserInfoFromLocalstorage().userId;
    this.name = `${this.appService.getUserInfoFromLocalstorage().firstName} ${this.appService.getUserInfoFromLocalstorage().lastName}`

    this.getALLUsers();
    
    this.currentIssueId = this._route.snapshot.paramMap.get("issueId");

     this.appService.getIssueData(this.currentIssueId).subscribe(

      data => {
        this.currentIssue = data["data"];
        console.log("Anvesh");
        console.log(this.currentIssue);
        this.currentIssue.assignee.forEach(element => {
          
          this.selectedAssignee.push(element.name);
          });
         
          console.log("annnnnnnnnnnnnnnvvvvvvvvvvveeeeeee"+this.selectedAssignee)

        
        this.assigneeControl.setValue(this.selectedAssignee);
      
      },
      error => {
        console.log(error.errormessage);
      }
    )
    //console.log("annnnnnnnnnnnnnnvvvvvvvvvvveeeeeee"+ this.currentIssue)
   //end of getALLUsers
  
  }
public getALLUsers() {

    this.appService.getAllUsers().subscribe(
      data => {

        let userArray = data['data'];
        setTimeout(() => {
          userArray.filter(x => {
            let userObj = {
              name: `${x.firstName} ${x.lastName}`,
              userId: x.userId
            }
            if (x.userId != this.userId) {
              this.users.push(userObj)
            }
          })
        }, 2000);

      }, (err) => {

        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000,
        });

        setTimeout(() => {
          this.router.navigate(['/create-issue'])
        }, 500);

      });

  }//end of get all users.

  public editIssue=()=>{

    this.appService.editIssueData(this.currentIssue).subscribe(
  
      data => {
        //this.currentBlogData=data["data"];
        console.log(data["data"]);
        this.snackBar.open("Blog Edited Succesfully!", 'Success!');
        setTimeout(() => {
          this.router.navigate(['/all-issues']);
        }, 1000);
  
      },
      error => {
        console.log(error.errormessage);
        this.toastr.error("Error Occured!", 'oops!')
      }
    )
  
  }

public addComment=()=>{

  let commentData = {
    issueId: this.currentIssueId,
    comment: this.issueComment,
    commenterId:this.userId,
    commenterName:this.name
  }

  this.appService.postCommentData(commentData).subscribe(

    data => {
      //this.currentBlogData=data["data"];
      console.log(data["data"]);
      this.toastr.success("Comment Posted Succesfully!", 'Success!');
      setTimeout(() => {
        this.router.navigate(['/all-issues']);
      }, 1000);

    },
    error => {
      console.log(error.errormessage);
      this.toastr.error("Error Occured!", 'oops!')
    }
  )

}

public addWatchee=()=>{

  let watcheeData = {
    issueId: this.currentIssueId,
   // comment: this.issueComment,
    watcherId:this.userId,
    watcherName:this.name
  }

  this.appService.addWatchee(watcheeData).subscribe(

  data => {
    //this.currentBlogData=data["data"];
    console.log(data["data"]);
    this.toastr.success("you added as watcher to this issue Succesfully!", 'Success!');
  },
  error => {
    console.log(error.errormessage);
    this.toastr.error("Error Occured!", 'oops!')
  }
)


}
  public getPrevPage()
  {
    this.location.back();
  }

}
