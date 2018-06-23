import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class ApiService {
  private api = 'https://voicerec-travel-agency.herokuapp.com/api';

  constructor(private http: Http) {
  }

  SendInput(userId: number, message: String){
      let jsonString = '{ "session_uid":"' + userId.toString() + '",  "request":"' + message + '" }';
      return this.http.post(this.api, jsonString);
  }

}
