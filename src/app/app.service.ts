import { Injectable } from '@angular/core';
//import { observable } from 'rxjs';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { HttpClient, HttpHeaders} from '@angular/common/http';

import { HttpErrorResponse,HttpParams} from '@angular/common/http';

import 'rxjs/operator/catch';
import 'rxjs/operator/do';
import 'rxjs/operator/toPromise';
//import { Observable } from 'rxjs/observable';
import { Observable } from 'rxjs/observable';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url= 'http://localhost:3000';

  constructor(public _http: HttpClient) { }

  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('apiKey', data.apiKey);

    return this._http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this._http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  
  
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

  public getAllUsers() {

    let response = this._http.get(`${this.url}/api/v1/users/view/all?authToken=${Cookie.get('authToken')}`);

    return response;

  }

  public myIssues(): Observable<any>{
   // console.log("jjjjjjjjjjjjjjjjjjjjjjjj"+data);
   let userId = this.getUserInfoFromLocalstorage().userId;

    return this._http.get(`${this.url}/api/v1/issues/${userId}/assigneeIssues?authToken=${Cookie.get('authToken')}`);
  }

  public allIssues(): Observable<any>{
    // console.log("jjjjjjjjjjjjjjjjjjjjjjjj"+data);
     
     return this._http.get(`${this.url}/api/v1/issues/view/all?authToken=${Cookie.get('authToken')}`);
   }

  public createIssue(data):Observable<any>{

    let reporter = [];
    let name = `${this.getUserInfoFromLocalstorage().firstName} ${this.getUserInfoFromLocalstorage().lastName}`
    let userId = this.getUserInfoFromLocalstorage().userId
    let reporterObj = {
      name: name,
      userId: userId
    }
    reporter.push(reporterObj);

    // stringify the object for sending
    let reporterArray = JSON.stringify(reporter)

    let assigneeArray=JSON.stringify(data.assignee)

    const params = new HttpParams()
      .set('title', data.title)
      .set('reporter', reporterArray)
      .set('assignee', assigneeArray)
      .set('description', data.description)
      .set('status', data.status);

    return this._http.post(`${this.url}/api/v1/issues/create?authToken=${Cookie.get('authToken')}`, params)
  }

  public getIssueData(currentIssueID): any {

    //let baseURL1=this.baseURL+'view/:'+currentBlogID+'?authToken='+this.authToken;
      //console.log(baseURL1);/:issueId/edit
      let myresponse=this._http.get(`${this.url}/api/v1/issues/${currentIssueID}/details?authToken=${Cookie.get('authToken')}`); 
      return myresponse;
  
    }
  
    public editIssueData(data):any{

      let currentIssueID=data.issueId;

      return this._http.put(`${this.url}/api/v1/issues/${currentIssueID}/edit?authToken=${Cookie.get('authToken')}`,data)
    }
  

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}


