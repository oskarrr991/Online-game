import { IUser } from './../../models/user/user.model';
import { AuthService } from './../../services/auth.service';
import { LobbyService } from './../../services/lobby.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/models/room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  players = [];
  currentUserId: string;
  roomNum: number;
  room: IRoom;
  formatedDate: string;
  currentPlayer: IUser;
  lookingForFight = false;
  playersWaiting: Array<string>;
  matchedPlayers = [];
  playersUserNames = [];
  opponent: IUser;

  constructor(private _lobbyService: LobbyService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private el: ElementRef) { }

  ngOnInit() {
    this.roomNum = this._activatedRoute.snapshot.params.roomNum; //ROOM number
    this.getCurrentUserId();
    this.getRoomPlayers(this.roomNum);
    this.getCurrentPlayer(this.currentUserId);
  }

  private getRoomPlayers(roomNum: number): IRoom {
    const roomId = 'Room ' + roomNum;
    this._lobbyService.getRoom(roomId).subscribe(room => {
      this.room = room;
      this.playersWaiting = room.playersWaiting;
      this.players = room.players;
    });
    return this.room;
  }

  public lookForAFight() {
    this.room.playersWaiting.push(this.currentUserId);
    this.updateRoom(this.roomNum, this.room);
    // this.joinRandomPlayers();
    this.lookingForFight = true;
    this.getCurrentPlayer(this.currentUserId);
  }

  public stopLookingForAFight() {
    const currentUserPosition = this.room.playersWaiting.indexOf(this.currentUserId);
    this.room.playersWaiting.splice(currentUserPosition, 1);
    this.playersWaiting = this.room.playersWaiting;
    this.updateRoom(this.roomNum, this.room);
    this.lookingForFight = false;
  }

  private getRoomPlayersUserNames(): Array<string> { // when we have player username
    for (const player of this.players) {
      this._authService.getPlayer(player).subscribe(user => {
        this.playersUserNames.push(user.fullName);
      });
    }
    return this.playersUserNames;
  }

  public sendMessage(message: string): void {
    const sentMessage = message;
    this.getCurrentDate();
    const playerSentMessage = this.formatedDate + ' ' + this.currentUserId + ': ' + sentMessage;
    this.room.chat.push(playerSentMessage);
    this.updateRoom(this.roomNum, this.room);
  }

  // private joinRandomPlayers() {
  //   if (this.playersWaiting.length > 1) {
  //     this.matchedPlayers = this.playersWaiting.sort(() => .5 - Math.random()).slice(0, 2);
  //     let opponentId = '';
  //     const currentUserPosition = this.matchedPlayers.indexOf(this.currentUserId);
  //     if (currentUserPosition === 0) {
  //       opponentId = this.matchedPlayers[1];
  //       this.getOpponentPlayer(opponentId);
  //     } else {
  //       opponentId = this.matchedPlayers[0];
  //       this.getOpponentPlayer(opponentId);
  //     }
  //     this.currentPlayer.opponentId = opponentId;
  //     this._authService.updatePlayer(this.currentUserId, this.currentPlayer);
  //     this.checkIfJoined();
  //   }
  // }

  // private checkIfJoined() { // 
  //   this._authService.getPlayers()
  //   .subscribe(data => {
  //     for (const user of data) {
  //       if (user.opponentId === this.currentUserId) {
  //         this.updateOpponent(user.opponentId);
  //         this.stopLookingForAFight();
  //         this.leaveRoom();
  //         this._router.navigateByUrl('/arena');
  //       } else {
  //         console.log('test');
  //         console.log(this.currentPlayer);
  //         console.log(user);
  //       }
  //     }
  //   });
  // }

  private getCurrentUserId(): string {
    this.currentUserId = this._authService.getUserId();
    return this.currentUserId;
  }

  private updateRoom(roomNum: number, data: IRoom): Promise<void> {
    const roomId = 'Room ' + roomNum;
    return this._lobbyService.updateRoom(roomId, data);
  }

  public leaveRoom(): void {
    let roomId = 'Room ' + this.roomNum;
    const currentUserPosition = this.room.players.indexOf(this.currentUserId);
    this.room.players.splice(currentUserPosition, 1);
    this.stopLookingForAFight();
    this.room.playerCount -= 1;

    if (this.room.players.length === 0) {
      this.room.chat = [];
    }
    this.currentPlayer.room = -1;
    this._authService.updatePlayer(this.currentUserId, this.currentPlayer);
    this._lobbyService.updateRoom(roomId, this.room);
    this._router.navigateByUrl('/lobby');
  }

  private getCurrentDate(): string {
    this.formatedDate = '';
    const fullDate = new Date();
    const hours = fullDate.getHours();
    let hoursString = '';
    if (hours < 10) {
      hoursString = `0${hours.toString()}`;
    } else {
      hoursString = hours.toString();
    }
    const minutes = fullDate.getMinutes();
    let minutesString = '';
    if (minutes < 10) {
      minutesString = `0${minutes.toString()}`;
    } else {
      minutesString = minutes.toString();
    }
    this.formatedDate = hoursString + ':' + minutesString;
    return this.formatedDate;
  }

  private getCurrentPlayer(playerId: string): IUser {
    this._authService.getPlayer(playerId).subscribe(player => {
      this.currentPlayer = player;
      if (player.opponentId && player.opponentId !== '') {
        this.stopLookingForAFight();
        this.leaveRoom();
        this._router.navigateByUrl('/arena');
      }
    });
    return this.currentPlayer;
  }

  // private getOpponentPlayer(opponentId: string) {
  //   this._authService.getPlayer(opponentId).subscribe(player => {
  //     this.opponent = player;
  //   });
  // }

  // private updateOpponent(opponentId: string) {
  //   this.opponent.opponentId = this.currentUserId;
  //   this._authService.updatePlayer(opponentId, this.opponent);
  // }


}
