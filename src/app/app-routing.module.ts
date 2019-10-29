import { CannotFoundComponent } from './components/404/404.component';
import { AuthGuard } from './auth.guard';
import { RoomComponent } from './components/room/room.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { MapComponent } from './components/map/map.component';
import { NewsComponent } from './components/news/news.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from '../app/components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { FormsComponent } from './components/profile/forms/forms.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register-user', component: SignUpComponent },
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'header', component: HeaderComponent, canActivate: [AuthGuard]
  },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard]
  },
  {
    path: 'map', component: MapComponent, canActivate: [AuthGuard]
  },
  {
    path: 'news', component: NewsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard]
  },
  {
    path: 'room/:roomNum', component: RoomComponent, canActivate: [AuthGuard]
  },
  { path: 'profile', component: FormsComponent, canActivate: [AuthGuard] },
  { path: '**', component: CannotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
