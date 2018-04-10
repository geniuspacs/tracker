import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

// Providers - Servicios
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

// Paginas
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements AfterViewInit {

  @ViewChild(Slides) slides: Slides;
  clave: string = "epc";

  constructor(public navCtrl: NavController, private usProv: UsuariosProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

  }

  // verifica si la clave es válida
  continuar() {

    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });

    loading.present();

    this.usProv.verifica_usuario(this.clave)
        .then( valido => {
          loading.dismiss();

          if(valido) {
            // Continuar a la siguiente pantalla
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
          } else {
            // Usuario inválido
            this.alertCtrl.create({
              title: "Clave incorrecta",
              subTitle: "Por favor, verifique su clave o contacte con el administrador",
              buttons: ["Aceptar"]
            }).present();
          }

        }).catch( error => {
          loading.dismiss();
          console.log("Error al verificar usuario: " + JSON.stringify(error));
        });
  }

  // Va al home una vez verificado el acceso
  ingresar() {
    this.navCtrl.setRoot(HomePage);
  }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = "progress";
  }

}
