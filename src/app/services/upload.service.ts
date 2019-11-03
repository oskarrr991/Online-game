import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Upload } from '../models/upload.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  name: any;
  // db: any;
  constructor(private afStorage: AngularFireStorage, private db: AngularFirestore) {

  }
  private basePath = '/uploads';
  uploads: Observable<Upload[]>;

  imgPath;
  uploadProgress: any;
  downloadURL;
  task;
  upload: new () => Upload;

//   pushUpload(upload: Upload) {
//     // const storageRef = firebase.storage().ref();
//     const storageRef = this.afStorage.ref('uploads');
//     const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
//     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
//       (snapshot) =>  {
//         // upload in progress
//         upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       },
//       (error) => {
//         // upload failed
//         console.log(error);
//       },
//       () => {
//         // upload success
// // tslint:disable-next-line: deprecation
//         upload.url = uploadTask.snapshot.downloadURL;
//         upload.name = upload.file.name;
//         this.saveFileData(upload);
//       }
//     );
//   }

  // private saveFileData(upload: Upload) {
  //   this.db.collection(`${this.basePath}/`).add(upload);
  // }


  pushUpload(event: FileList) {
    // File object
    const file = event.item(0);
    console.log(file);

    // client side validation
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type!');
    }


    // storage path
    this.imgPath = `uploads/${file.name}`;
    const fileRef = this.afStorage.ref(this.imgPath);
    this.db.collection(`${this.basePath}/`).add(this.upload);
    // const save = this.db.collection(`${this.basePath}/`).add(this.upload);

    // optional metadata
    // const customMetadata = { app: 'Angular-FireBase-Gallery'};
    // main task
    // this.task = this.afStorage.upload(this.imgPath, file);

    this.afStorage.upload(this.imgPath, file).snapshotChanges().subscribe(data => console.log(data));
    // observe percentage changes
    // this.uploadProgress = this.task.percentageChanges();
    // get notified when the download URL is available
    // this.task.snapshotChanges()
    // .subscribe();
  }



// deleteUpload(upload: Upload) {
//   this.deleteFileData(upload.$key)
//   .then( () => {
//     this.deleteFileStorage(upload.name);
//   })
//   .catch(error => console.log(error));
// }

// // Deletes the file details from the realtime db
// private deleteFileData(key: string) {
//   return this.db.collection(`${this.basePath}/`);
// }

// // Firebase files must have unique names in their respective storage dir
// // So the name serves as a unique key
// private deleteFileStorage(name: string) {
//   const storageRef = firebase.storage().ref();
//   storageRef.child(`${this.basePath}/${name}`).delete();
// }

}
