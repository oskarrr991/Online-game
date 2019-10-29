import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss']
})
export class CannotFoundComponent implements OnInit {
  loggedIn: boolean;

  constructor(private _authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  public isLoggedIn(): void {
    this.loggedIn = this._authService.isLoggedIn;
    if (this.loggedIn) {
      this.router.navigateByUrl('/main');
    } else {
      this.router.navigateByUrl('/');
    }
  }

}
