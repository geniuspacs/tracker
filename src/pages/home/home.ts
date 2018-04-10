import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';

import { LoginPage } from '../login/login';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuario:any = {};

  constructor(public navCtrl: NavController, private ubicacionProv: UbicacionProvider, private userService: UsuariosProvider) {
    this.ubicacionProv.iniciar_localizacion();
    this.ubicacionProv.usuario
        .subscribe(data => {
          console.log(data);
          this.usuario = data;
        });
  }

  salir() {
    this.userService.borrar_usuario();
    this.ubicacionProv.detener_watch();
    this.navCtrl.setRoot(LoginPage);
  }

}
