import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular'

@Injectable()
export class UsuariosProvider {

  clave:string = "";

  constructor(private afDB: AngularFireDatabase, private storage: Storage, private platform: Platform) {

  }

  verifica_usuario(clave:string) {
    clave = clave.toLowerCase();
    console.log("Clave recibida: " + clave);
    let promesa = new Promise( (resolve, reject) => {
      this.afDB.list('/usuarios/' + clave).subscribe( data => {
        if(data.length === 0) {
          // Clave incorrecta
          resolve(false);
        } else {
          // Clave correcta
          this.clave = clave;
          this.guardar_storage();
          resolve(true);
        }

      });
    }).catch( error => {
      console.log("Error en promesa service: " + JSON.stringify(error));
    });

    return promesa;
  }

  guardar_storage() {
    let promesa = new Promise( (resolve, reject) => {
      if(this.platform.is("cordova")) {
        // Dispositivo
        this.storage.set("clave", this.clave);
      } else {
        // Escritorio
        if(this.clave) {
          localStorage.setItem("clave", this.clave);
        } else {
          localStorage.removeItem("clave");
        }

        console.log("clave localStorage? ", this.clave);
      }
    });

    return promesa;
  }

  cargar_storage() {

    let promesa = new Promise( (resolve, reject) => {
      if(this.platform.is("cordova")) {
        // Dispositivo
        this.storage.ready().then( ()=> {
          this.storage.get("clave").then( (clave)=> {
            this.clave = clave;
            resolve();
          });
        });
      } else {
        // Escritorio
        this.clave = localStorage.getItem("clave");
        resolve();
      }
    });

    return promesa;
  }

  borrar_usuario() {
    this.clave = null;
    this.guardar_storage();
  }

}
