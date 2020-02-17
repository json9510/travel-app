import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the BackendProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackendProvider {

  public apiServer: String = "https://travelappweb.com/api";
  public mediaServer: String = "https://travelappweb.com";

  //public apiServer: String = "http://18.217.214.181/travelapp-pruebas";
  //public apiServer: String = "http://192.168.1.5/TravelApp-Admin";
  constructor(
    public http: HttpClient,
    private toastCtrl: ToastController) {
    console.log('Hello BackendProvider Provider');
  }

  public getData(getUrl: string) {
    return new Promise((resolve, reject) => {
      this.http.get(getUrl)
        .timeout(9000)
        .subscribe((res) => {
          try {
            let data = res;
            resolve(data);
          } catch (e) {
            console.log(e);
          }
        },
          err => {
            resolve([]);
            reject(err);
            this.showToast("Error");
          }
        );
    });
  }

  postData(params, postUrl: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post(postUrl, params, {headers:headers})
        .timeout(9000)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          this.showToast(err.error["error"]);
        });
    });
  }

  getVersionApp() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiServer + '/application-version/lastVersion.json')
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getPackageFavorite(userId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiServer + '/packages-favorites-list/'+userId+'/')
        .timeout(9000)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          this.showToast("error");
        });
    });
  }

  addPackageFavorite(info) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.http.post(this.apiServer + '/save-favorite/', info, {headers:headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  removePackageFavorite(info) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.http.post(this.apiServer + '/remove-favorite/', info, {headers:headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          this.showToast("Error");
        });
    });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 8000,
      position: 'bottom'
    });
    toast.present();
  }


}
