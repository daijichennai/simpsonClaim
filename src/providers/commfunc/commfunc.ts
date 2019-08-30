import { Injectable } from '@angular/core';
@Injectable()
export class CommfuncProvider {

  public domainURL:string = "http://simpsonwms.arkaautomaations.com/";
  constructor() {
  }   

  getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
  };

   convertINR(amt) {
     return amt.toLocaleString("en-IN", { currency: "INR" })
  }

  getDate(){
    var date_to_parse = new Date();
    var year = date_to_parse.getFullYear().toString();
    var month = (date_to_parse.getMonth() + 1).toLocaleString();
    var day = date_to_parse.getDate().toLocaleString();
    var hour = date_to_parse.getHours().toLocaleString();
    var minute = (date_to_parse.getMinutes() + 1).toLocaleString();
    var sec = date_to_parse.getSeconds().toLocaleString();

    return  year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;
  }

   

}
