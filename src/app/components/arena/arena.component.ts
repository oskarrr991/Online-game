import { IUser } from './../../models/user/user.model';
import { Subscription } from 'rxjs';
import { IWeapon } from './../../models/weapon.model';
import { FightService } from '../../services/fight.service';
import { Armory, Weaponry } from '../../classes';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {

  currentPlayer: IUser;
  oponnentPlayer: IUser;

  room = 'Room 4';

  opponentId = '';

  constructor(public _fight: FightService,
              public _weaponry: Weaponry,
              public _armory: Armory) { }

  ngOnInit() {
    this.getPlayerIds(this.room);
  }

  // GETING IDs and OBJECTS of PLAYER and hers OPPONENT

  // We get IDs from a room where two players agreed to fight. 
  // And we use localStorage to comfirm that we have the right player.
  private getPlayerIds(room: string): Subscription {
    return this._fight.getPlayersFromRoom(room)
      .subscribe(data => {
        console.log(data);
        if (data.player1 === this.getCurrentPlayerId()) {
          this.getCurrentPlayer(data.player1);
          this.getOpponentPlayer(data.player2);
          this.opponentId = data.player2;
        } else {
          this.getCurrentPlayer(data.player2);
          this.getOpponentPlayer(data.player1);
          this.opponentId = data.player1;
        }
      });
  }

  private getCurrentPlayerId(): string {
    return localStorage.getItem('user');
  }

  private getCurrentPlayer(id: string): Subscription {
    return this._fight.getPlayer(id)
      .subscribe(data => {
        this.currentPlayer = data;
        console.log(data);
      });
  }

  private getOpponentPlayer(id: string): Subscription {
    return this._fight.getPlayer(id)
      .subscribe(data => {
        this.oponnentPlayer = data;
        console.log(data);
      });
  }

  // CHOOSING WEAPON, ARMOR, ATTACK and DEFENCE

 public chooseWeapon(weaponId: string) {
    for (const weapon of this.currentPlayer.weaponRight) {
      if (weapon.id === weaponId) {
        this.currentPlayer.fighter.weaponRight = weapon;
      }
    }
  }

  public chooseArmor(protec: string, armorId: string) {
    if (protec === 'head') {
      for (const armor of this.currentPlayer.armorHead) {
        if (armor.id === armorId) {
          this.currentPlayer.fighter.armorHead = armor;
        }
      }
    }
    if (protec === 'torso') {
      for (const armor of this.currentPlayer.armorTorso) {
        if (armor.id === armorId) {
          this.currentPlayer.fighter.armorTorso = armor;
        }
      }
    }
    if (protec === 'arms') {
      for (const armor of this.currentPlayer.armorArms) {
        if (armor.id === armorId) {
          this.currentPlayer.fighter.armorArms = armor;
        }
      }
    }
    if (protec === 'legs') {
      for (const armor of this.currentPlayer.armorLegs) {
        if (armor.id === armorId) {
          this.currentPlayer.fighter.armorLegs = armor;
        }
      }
    }
  }

  public chooseAttack(bodyPart: string) {
    this.currentPlayer.fighter.attack = bodyPart;
  }

  public chooseDefence(bodyPart: string) {
    this.currentPlayer.fighter.defence = bodyPart;
  }

  // STARTING FIGHT and UPDATING DB with RESULTS

  // When Player pushes the button its property "ready" sets to true
  // But we have to wait until oponent selects hers mooves also
  fight() {
    // this._fight.calculateCombat(this.fighterOneId, this.fighterTwoId);
    this.currentPlayer.fighter.ready = true;
    this.updateCurrentPlayer()
      .then(() => {
        this.ifOpponentReadyThenFight();
      });
  }

  private updateCurrentPlayer(): Promise<void> {
    return this._fight.updatePlayer(this.getCurrentPlayerId(), this.currentPlayer);
  }

  private ifOpponentReadyThenFight(): Subscription {
    return this._fight.getPlayer(this.opponentId)
      .subscribe(data => {
        if (data.fighter.ready) {
          console.log(data);
          this.currentPlayer = this.calculateCurrentLosses(data);

          this.currentPlayer.fighter.ready = false;
          this.updateCurrentPlayer();
        }
      });
  }

  private calculateCurrentLosses(player: IUser): IUser {
    return this._fight.calculateCombat(this.currentPlayer, player);
  }

}
