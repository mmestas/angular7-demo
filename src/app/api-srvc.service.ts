import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AddonObj } from './observableObjects';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpGetOptions  = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json'
    }
  ),
  withCredentials: true
};

const httpPostOptions = {
  headers: new HttpHeaders (
      {
          "Content-Type": "application/x-www-form-urlencoded"
      }),
  withCredentials: true,
};

let locationURL =  '';

let existingStylesheets = [];
for (var i=0; i<document.styleSheets.length; i++) {
  var sheet = document.styleSheets[i].href;
  if (existingStylesheets.indexOf(sheet) !== -1) {
       console.log(sheet);

   }
   else {existingStylesheets.push(sheet)}
}
console.log(existingStylesheets);

if(window.location.hostname === 'localhost') {
  locationURL =  'http://angular7tool.com';
}
else {
  locationURL =  '';
}


@Injectable({
  providedIn: 'root'
})

export class ApiSrvc {

  constructor(private http: HttpClient) { }

  apiUrl = locationURL;
  styleSheets = existingStylesheets;


  getangular7toolPanelList(parentContentGuid, parentRecordGuid) {

    return this.http.post(locationURL+'/getaddonPanellist', {
        "parentContentGuid":parentContentGuid,
        "parentRecordGuid":parentRecordGuid
      }, httpGetOptions)
      .pipe();
  }

  getangular7toolAddonList(parentContentGuid, parentRecordGuid) {
    return this.http.post(locationURL+'/getAddonList', {
        "parentContentGuid":parentContentGuid,
        "parentRecordGuid":parentRecordGuid,
        "includeRenderedHtml": true
      }, httpGetOptions)
      .pipe();
  }

  setangular7toolAddonList(data) {
    return this.http.post(locationURL+'/setAddonList', data, httpGetOptions)
  }



  deleteangular7toolAddonList(data) {
    return this.http.post(locationURL+'/DeleteAddonListInstance', data, httpGetOptions)
  }

}
