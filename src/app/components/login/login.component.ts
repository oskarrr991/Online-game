import { LobbyService } from './../../services/lobby.service';
import { AuthService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authLogin: any;
  durationInSeconds = 5;


  constructor(public authService: AuthService,
    private _snackBar: MatSnackBar,
    private _lobbyService: LobbyService) { }

  ngOnInit() {
    this.createloginForm();
  }
  private createloginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  public login(email: string, password: string) {
    this.authService.login(email, password);
  }
  public fbLogin() {
    return this.authService.doFacebookLogin();
  }
  public googleLogin() {
    return this.authService.doGoogleLogin();
  }
  // openSnackBar() {
  //   this._snackBar.openFromComponent(LoginComponent, {
  //     duration: this.durationInSeconds * 1000,
  //   });
  // }

  // public get isLoggedIn(): boolean {
  //       return this.authService.isLoggedIn;
  //     }
  //     public isLoggedOut() {
  //       return this.authService.logout();
  //     }


}
