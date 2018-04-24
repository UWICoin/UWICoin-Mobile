import { ToastProvider } from './../../providers/toast/toast';
import { DatabaseProvider } from './../../providers/database/database';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { AngularFireStorage } from 'angularfire2/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IUser } from '../../models/user/user.models';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  user$: Observable<IUser>;

  constructor(public actionSheetCtrl: ActionSheetController,
    public afStorage: AngularFireStorage,
    public authProvider: AuthenticationProvider,
    private camera: Camera,
    private dbProvider: DatabaseProvider,
    private imagePicker: ImagePicker,
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastProvider: ToastProvider) {

    this.user$ = this.authProvider.getUser$();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  changePassword() {
    this.navCtrl.push('PasswordResetPage');
  }

  getImageFromCamera() {
    const options: CameraOptions = {
      cameraDirection: this.camera.Direction.FRONT,
      correctOrientation: true,
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(imageData => {
      let img = `data:image/jpeg;base64,${imageData}`;
      this.user$.take(1).subscribe(user => {
        this.dbProvider.setObject(`users/students/${user.uid}/photoURL`, img).then(snapshot => {
          this.toastProvider.showToast('Image uploaded successfully');
        }, error => {
          console.error(error);
          this.toastProvider.showToast('Image upload failed');
        });
      });
    }, error => {
      console.error(error);
      this.toastProvider.showToast(error);
    });
  }


  getImageFromGallery() {
    let options = {
      maximumImagesCount: 1,
      width: 200,
      height: 200,
      quality: 50
    }
    this.imagePicker.getPictures(options).then(image => {
      console.log(image);
    }, error => {
      console.error(error);
      this.toastProvider.showToast(error);
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose image location',
      buttons: [
        {
          text: 'Gallery',
          role: 'destructive',
          handler: () => {
            this.getImageFromGallery();
          }
        },
        {
          text: 'Camera',
          role: 'destructive',
          handler: () => {
            this.getImageFromCamera();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    actionSheet.present();
  }

}
