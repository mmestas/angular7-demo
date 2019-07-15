import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ApiSrvc } from './api-srvc.service';



@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  locationURL = {};

  constructor(private sanitizer: DomSanitizer, private apiSrvc: ApiSrvc) {}
  transform(url) {
    // Gets the domain
    this.locationURL = this.apiSrvc.apiUrl;
    let existingStylesheets = this.apiSrvc.styleSheets;

    function checkUrl(ss) {
      // check if stylesheet url exists in the DOM
      if(ss === url) {
          // if there is a match, remove the url
          url = '';
          return true;
      }
    }

    existingStylesheets.find(checkUrl)
    // this.existingStylesheets.find(checkUrl)

    // Finds urls that start with http
    var http = /http/i;
      var type = url.match(http);
      if(type) {
      }
      else {
        // if the url doesn't start with http, use the locationURL
        url = this.locationURL+url;
      }


    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
