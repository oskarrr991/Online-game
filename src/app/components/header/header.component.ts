import { ActivatedRoute } from '@angular/router';
import { LobbyService } from './../../services/lobby.service';
import { IUser } from './../../models/user/user.model';
import { AuthService } from '../../services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;

  constructor(private _auth: AuthService, private _route: ActivatedRoute) { }

  ngOnInit() {
  }

  public get isLoggedIn(): boolean {
    this.loggedIn = this._auth.isLoggedIn;
    return this.loggedIn;
  }

  public logout(): Promise<void> {
    return this._auth.logout();
  }

  public getSelectedRoute() {
    this._route.snapshot
  }

}
