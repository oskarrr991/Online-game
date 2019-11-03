import { Upload } from './../../../models/upload.model';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {
  imagePath: string;
  img: string;
  buttonClicked = false;
  userDetailsForm: FormGroup;
  userId: string;
  currentPlayer: any;

  selectedFiles: FileList;
  currentUpload: Upload;

   // Main task
 task: AngularFireUploadTask;

 // Progress monitoring
 percentage: Observable<number>;

 snapshot: Observable<any>;

 // Download URL
 downloadURL: Observable<string>;

 // State for dropzone CSS toggling
 isHovering: boolean;

  genders = [
    'Male',
    'Female',
    'Other'
  ];

  playerObj = {
    fullname: '',
    bio: '',
    birthday: '',
    gender: '',
    photoPath: ''
  };
  url = '';

  validationMess = {
    fullname: [
      { type: 'required', message: 'Full name is required' }
    ],
    bio: [
      { type: 'maxlength', message: 'Bio cannot be more than 256 characters long' },
    ],
    gender: [
      { type: 'required', message: 'Please select your gender' },
    ],
    birthday: [
      { type: 'required', message: 'Please insert your birthday' },
    ],
  };

  constructor(private fb: FormBuilder,
              public authService: AuthService,
              /* private upSvc: UploadService */
              private db: AngularFirestore,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    this.createForms(this.playerObj);
    this.loadData();
  }

  createForms(player) {
    let convertedDate;
    if (player.birthDate) {
      convertedDate = new Date(player.birthDate.seconds * 1000).toISOString();
    }
    this.userDetailsForm = this.fb.group({
      fullname: [player.fullname, Validators.required ],
      bio: [player.bio, Validators.maxLength(256)],
      birthday: [convertedDate, Validators.required],
      gender: new FormControl(player.gender, Validators.required),
      photoPath: new FormControl(player.photoURL),
    });

  }

  loadData() {
    this.userId = this.authService.getUserId();
    this.authService.getPlayer(this.userId).subscribe(player => {
      this.createForms(player);
      this.setImageURL(player.photoURL);
    });
  }

  onSubmitUserDetails(value) {
    this.authService.submitUser(value);
    console.log(value.birthday);
  }

  setImageURL(url) {
    this.img = url;
    if (!this.img) {
        this.img = '../../../assets/ddd.png';
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }


  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;
    this.db.collection('photos').add( { path });

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();

    // The file's download URL
    // this.downloadURL = this.task.downloadURL();
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

//   detectFiles(event) {
//     this.selectedFiles = event.target.files;
// }

// uploadSingle() {
//   // const file = this.selectedFiles.item(0);
//   // this.currentUpload = new Upload(file);
//   // this.upSvc.pushUpload(this.selectedFiles);
// }

// uploadMulti() {
//   const files = this.selectedFiles;
//   // const filesIndex = _.range(files.length);
//   // _.each(filesIndex, (idx) => {
//   //   this.currentUpload = new Upload(files[idx]);
//   //   this.upSvc.pushUpload(this.currentUpload); }
//   // );
// }
}
