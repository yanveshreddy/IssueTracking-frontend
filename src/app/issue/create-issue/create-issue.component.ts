import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/components/common/selectitem';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css']
})
export class CreateIssueComponent implements OnInit {


  public issueTitle: String;
  public issueAssignee=[];
  public issueDescription: any= '<p>Hi</p>';
  public issueStatus: String;
  public selectFile: File = null;
  public imageUrl: string;
  public warning: boolean = false;
  message: string;
  users=[];
  userId:any;
  name:string;

  public statuslist = ["in- progress", "in- backlog", "in- testing", "Done"];

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

  constructor(public appService: AppService, private _route: ActivatedRoute, private router: Router, public toastr: ToastrService,public snackBar:MatSnackBar) {

  }

  ngOnInit() {

    //this.checkStatus();

    this.getALLUsers();

    this.userId = this.appService.getUserInfoFromLocalstorage().userId;
    this.name = `${this.appService.getUserInfoFromLocalstorage().firstName} ${this.appService.getUserInfoFromLocalstorage().lastName}`

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
  public createIssue(): any {
    let issueData = {
      title: this.issueTitle,
      assignee: this.issueAssignee,
      description: this.issueDescription,
      status: this.issueStatus
    }

    console.log(issueData);

    this.appService.createIssue(issueData).subscribe(

      data => {
        //this.currentBlog = data["data"];
        console.log("Issue Posted");
        console.log(data);

        this.snackBar.open('Issue Posted!', 'Success!');
        setTimeout(() => {

          this.router.navigate(['/all-issues']);
        }, 1000)



      },
      error => {

        console.log(error.errormessage);
        this.toastr.error('Some Error Occured!', 'Oops!');
      })

  }

}
