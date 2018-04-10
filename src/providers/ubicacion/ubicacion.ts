import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { UsuariosProvider } from '../usuarios/usuarios';

@Injectable()
export class UbicacionProvider {

  usuario: FirebaseObjectObservable<any[]>;
  private watch:any;

  constructor(private geolocalizacion: Geolocation, private afDB: AngularFireDatabase, private userService: UsuariosProvider) {
    this.usuario = this.afDB.object("/usuarios/" + this.userService.clave);
  }

  iniciar_localizacion() {
    this.watch = this.geolocalizacion.watchPosition()
      .subscribe((data) => {
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude

       if( !this.userService.clave ) {
         return;
       }
       
       this.usuario.update({
         lat: data.coords.latitude,
         lng: data.coords.longitude
       });
     });
  }

  detener_watch() {
    this.watch.unsubscribe();
  }

}
