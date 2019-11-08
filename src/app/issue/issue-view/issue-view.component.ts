import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import {SocketService} from 'src/app/socket.service'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';

//import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css'],
  providers: [Location]
})
export class IssueViewComponent implements OnInit {

  public currentIssue;
  public currentIssueId;

  public statuslist = ["in- progress", "in- backlog", "in- testing", "Done"];

  users = [];
  userList=[];
  userId: any;
  name: string;

  public issueComment;
  public selectedAssignee;
  changeText: boolean;
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
  disconnectedSocket: boolean;
  authToken:String;
 // assigneeControl = new FormControl();
  constructor(
    public appService: AppService,
    public SocketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    public toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit() {

    this.userId = this.appService.getUserInfoFromLocalstorage().userId;
    this.name = `${this.appService.getUserInfoFromLocalstorage().firstName} ${this.appService.getUserInfoFromLocalstorage().lastName}`

    this.getALLUsers();
    this.changeText = false;
    this.currentIssueId = this._route.snapshot.paramMap.get("issueId");

    this.appService.getIssueData(this.currentIssueId).subscribe(

      data => {
        this.currentIssue = data["data"];
        console.log("Anvesh");
        console.log(this.currentIssue);
        this.selectedAssignee = this.currentIssue.assignee[0].name;
        console.log(this.selectedAssignee)
      },
      error => {
        console.log(error.errormessage);
      }
    )
    //console.log("annnnnnnnnnnnnnnvvvvvvvvvvveeeeeee"+ this.currentIssue)
    //end of getALLUsers
    this.authToken = Cookie.get('authtoken');
    this.verifyUserConfirmation();

    this.getOnlineUserList();

    //get notifications
    this.getnotification();

  }
  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser()
      .subscribe(() => {

        this.disconnectedSocket = false;
        this.SocketService.setUser(this.authToken);
      });
  }


  // socket event to get online user list
  public getOnlineUserList: any = () => {

    this.SocketService.onlineUserList()
      .subscribe((userList) => {


        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': userList[x].userId, 'name': userList[x].fullName };

          this.userList.push(temp);

        }

        console.log('UserList>>>>>', this.userList);

      }); // end online-user-list
  }


  public getALLUsers() {

    this.appService.getAllUsers().subscribe(
      data => {

        let userArray = data['data'];

        userArray.filter(x => {
          let userObj = {
            name: `${x.firstName} ${x.lastName}`,
            userId: x.userId
          }

          this.users.push(userObj)

        });

      }, (err) => {

        this.toastr.error(`some error occured`, "Dismiss");

        setTimeout(() => {
          this.router.navigate(['/create-issue'])
        }, 500);

      });

  }//end of get all users.

  public editIssue = () => {

    this.appService.editIssueData(this.currentIssue).subscribe(

      data => {
        //this.currentBlogData=data["data"];
        console.log(data["data"]);
        this.toastr.success("Issue Updated Succesfully!", 'Success!');
        this.notification(`${this.name} has edited  ${this.currentIssue.title}`);
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

  public addComment = () => {

    let commentData = {

      issueId: this.currentIssueId,
      comment: this.issueComment,
      userId: this.userId,
      name: this.name
    }

    this.appService.postCommentData(commentData).subscribe(

      data => {
        //this.currentBlogData=data["data"];
        console.log(data["data"]);
        this.toastr.success("Comment Posted Succesfully!", 'Success!');
        this.notification(`${this.name} has Commented ${this.issueComment} on ${this.currentIssue.title}`);
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

  public addWatchee = () => {


    if (this.currentIssue.reporter[0].userId != this.userId &&
      !this.currentIssue.assignee.includes(this.userId) &&
      !this.currentIssue.watcher.includes(this.userId)) 
      
      {
          let watcheeData = {
            issueId: this.currentIssueId,
            // comment: this.issueComment,
            userId: this.userId,
            name: this.name
          }

          if (watcheeData) {
            this.appService.addWatchee(watcheeData).subscribe(

              data => {
                //this.currentBlogData=data["data"];
                console.log(data["data"]);
                this.toastr.success("you added as watcher to this issue Succesfully!", 'Success!');
                this.notification(`${this.name} has subscribed to ${this.currentIssue.title}`);
              },
              error => {
                console.log(error.errormessage);
                this.toastr.error("Error Occured!", 'oops!')
              }
            )
          }

          else {
            this.toastr.warning("Watchee cannot be Null!", 'oops!')
          }
        }

    else {

      this.toastr.warning("You are already watching Issue", 'oops!')
      return

    }


  }

  public notification(message) {
    // sending notification to watchers

    this.currentIssue.watchers.filter(x => {

      let notificationObj = {

        senderName: this.name,
        senderId: this.userId,
        receiverName: x.name,
        receiverId: x.userId,
        issueId: this.currentIssueId,
        message: message,

      }

      this.SocketService.sendnotification(notificationObj)

    })


    //sending notification to assignee's
    this.currentIssue.assignee.filter(x => {

      let notificationObj = {

        senderName: this.name,
        senderId: this.userId,
        receiverName: x.name,
        receiverId: x.userId,
        issueId: this.currentIssueId,
        message: message,

      }

      this.SocketService.sendnotification(notificationObj)
    })


    //sending notifications to Reporter
    if (this.userId != this.currentIssue.reporter[0].userId) {
      let notificationObj = {

        senderName: this.name,
        senderId: this.userId,
        receiverName: this.currentIssue.reporter[0].name,
        receiverId: this.currentIssue.reporter[0].userId,
        issueId: this.currentIssueId,
        message: message,

      }

      this.SocketService.sendnotification(notificationObj)
    }


  }


  // get notifications of the user
  public getnotification: any = () => {

    this.SocketService.notification(this.userId)
      .subscribe((data) => {

        let message = data;
        this.toastr.show(`${message.message}`, "Dismiss");
        setTimeout(() => {

          this.toastr.show(`${message.message}`, "Dismiss");
         
        }, 1000);

      }, (err) => {

        this.toastr.error(`some error occured`, "Dismiss")

        setTimeout(() => {
          this.router.navigate(['/500'])
        }, 500);

      });//end subscribe

  }// end get message from a user 


  public getPrevPage() {
    this.location.back();
  }

}
