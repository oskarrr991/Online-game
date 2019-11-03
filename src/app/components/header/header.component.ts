import { AuthService } from '../../services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;

  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }

  public get isLoggedIn(): boolean {
    this.loggedIn = this._auth.isLoggedIn;
    return this.loggedIn;
  }

  public logout(): Promise<void> {
    return this._auth.logout();
  }

}
