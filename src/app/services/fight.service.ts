import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { IUser } from './../models/user/user.model';
import { LobbyService } from './lobby.service';
import { IRoom } from 'src/app/models/room.model';
import { Armory } from './../classes/armor.class';
import { IArmor } from '../models/armor.model';
import { IWeapon } from '../models/weapon.model';
import { Weaponry } from './../classes/weapons.class';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FightService {

  room: IRoom;
  roomNum: number;

  playerOneId: string;
  playerTwoId: string;
  localId: string;
  currentPlayerId: string;
  currentPlayerHP: number;
  currentPlayer: IUser;

  playerOne: IUser;
  playerTwo: IUser;

  constructor(private _weaponry: Weaponry,
              private _armory: Armory,
              private _authService: AuthService,
              private _lobbyService: LobbyService) { }

  // VEIKIA
  public initFighters(rumNum: number) {
    this.getPlayersUids(rumNum);
  }

  // VEIKIA
  private getPlayersUids(roomNum: number) {
    const roomId = 'Room ' + roomNum;
    this._lobbyService.getRoom(roomId).subscribe(room => {
      this.room = room;
      this.playerOneId = this.room.player1;
      this.playerTwoId = this.room.player2;
      this.localId = localStorage.getItem('user');
      if (this.playerOneId === this.localId) {
        this.getPlayers(this.playerOneId);
      }
      if (this.playerTwoId === this.localId) {
        this.getPlayers(this.playerTwoId);
      }
    });
  }

  // VEIKIA
  private getPlayers(playerId: string) {
    if (playerId === this.playerOneId) {
      this._authService.getPlayer(playerId).subscribe(player => {
        this.playerOne = player; //AR REIKIA SITO?
        this.currentPlayerId = playerId;
        this.currentPlayer = player;
        console.log(this.playerOne.email);
      });
    }
    if (playerId === this.playerTwoId) {
      this._authService.getPlayer(playerId).subscribe(player => {
        this.playerTwo = player; //AR REIKIA SITO?
        this.currentPlayerId = playerId;
        this.currentPlayer = player;
        console.log(this.playerTwo.email);
      });
    }
  }

  public getPlayer(playerID: string): Observable<IUser> {
    return this._authService.getPlayer(playerID);
  }

  public getPlayersFromRoom(roomID: string): Observable<IRoom> {
    return this._lobbyService.getRoom(roomID.toString());
  }

  // Susisiekia su lobbyService esančia update funkcija ir nusiunčia jai naują data.
  public updatePlayer(playerId: string, data: IUser): Promise<void> {
    return this._authService.updatePlayer(playerId, data);
  }

  public calculateCombat(currentPlayerPar: IUser, opponentPlayer: IUser): IUser {

    let currentPlayer = currentPlayerPar;

    if (opponentPlayer.fighter.attack !== currentPlayer.fighter.defence) { // if opponent attacked succesfully
      currentPlayer = this.changeAttackedPartArmorDurability(opponentPlayer, currentPlayer);
      currentPlayer = this.changeCriticalCounterAndDmg(opponentPlayer, currentPlayer);
      currentPlayer.fighter.hp -= (opponentPlayer.fighter.weaponRight.damage +
      this.getCriticalDmg(opponentPlayer, currentPlayer) - this.getAttackedPartArmor(opponentPlayer, currentPlayer));
    }
    return currentPlayer;
  }


  // Different parts of fighters body can have different armor, thus we compare two strings from fighters[] objects
  // (attack and protec) to determin what kind of armor attacked body part has.
  // PAKEISTA
  private getAttackedPartArmor(opponentPlayer: IUser, currentPlayer: IUser): number {
    let armor = 0;
    if (opponentPlayer.fighter.attack === currentPlayer.fighter.armorHead.protec) {
      armor = currentPlayer.fighter.armorHead.armor;
    } else if (opponentPlayer.fighter.attack === currentPlayer.fighter.armorTorso.protec) {
      armor = currentPlayer.fighter.armorTorso.armor;
    } else if (opponentPlayer.fighter.attack === currentPlayer.fighter.armorArms.protec) {
      armor = currentPlayer.fighter.armorArms.armor;
    } else if (opponentPlayer.fighter.attack === currentPlayer.fighter.armorLegs.protec) {
      armor = currentPlayer.fighter.armorLegs.armor;
    } else {
      armor = 0;
    }
    return armor;
  }

  // PAKEISTA
  private getCriticalDmg(opponentPlayer: IUser, currentPlayer: IUser): number {
    let dmg = 0;

    if (opponentPlayer.fighter.attack ===
      currentPlayer.fighter.armorHead.protec) {
      dmg = currentPlayer.fighter.armorHead.criticalDmg;

      return dmg;
    }

    if (opponentPlayer.fighter.attack ===
      currentPlayer.fighter.armorTorso.protec) {
      dmg = currentPlayer.fighter.armorTorso.criticalDmg;

      return dmg;
    }

    if (opponentPlayer.fighter.attack ===
      currentPlayer.fighter.armorArms.protec) {
      dmg = currentPlayer.fighter.armorArms.criticalDmg;

      return dmg;
    }

    if (opponentPlayer.fighter.attack ===
      currentPlayer.fighter.armorLegs.protec) {
      dmg = currentPlayer.fighter.armorLegs.criticalDmg;

      return dmg;
    }
  }

  // Different armor has different durability (times it can be hit before it is destroyed).
  // NOTE: armor is destroyed only for the time of the combat, no changes are applyed to DB.
  // In future we could change how damaged body part looks (change svg).
  // PAKEISTA
  private changeAttackedPartArmorDurability(attackingFighter: IUser, defendingFighter: IUser) {

    const currentPlayer = defendingFighter;

    if (attackingFighter.fighter.attack === currentPlayer.fighter.armorHead.protec) {

      currentPlayer.fighter.armorHead.durability -= 1;

      if (currentPlayer.fighter.armorHead.durability < 0) {
        currentPlayer.fighter.armorHead.armor = 0;
      }
    }

    if (attackingFighter.fighter.attack === currentPlayer.fighter.armorTorso.protec) {

      currentPlayer.fighter.armorTorso.durability -= 1;

      if (currentPlayer.fighter.armorTorso.durability < 0) {
        currentPlayer.fighter.armorTorso.armor = 0;
      }
    }

    if (attackingFighter.fighter.attack === currentPlayer.fighter.armorArms.protec) {

      currentPlayer.fighter.armorArms.durability -= 1;

      if (currentPlayer.fighter.armorArms.durability < 0) {
        currentPlayer.fighter.armorArms.armor = 0;
      }

    }

    if (attackingFighter.fighter.attack === currentPlayer.fighter.armorLegs.protec) {

      currentPlayer.fighter.armorLegs.durability -= 1;

      if (currentPlayer.fighter.armorLegs.durability < 0) {
        currentPlayer.fighter.armorLegs.armor = 0;
      }

    }

    return currentPlayer;
  }

  // PAKEISTA
  private changeCriticalCounterAndDmg(attackingFighter: IUser, defendingFighter: IUser) {

    const currentPlayer = defendingFighter;

    if (attackingFighter.fighter.attack ===
      currentPlayer.fighter.armorHead.protec) {
      currentPlayer.fighter.armorHead.criticalDmgCounter -= 1;

      if (currentPlayer.fighter.armorHead.criticalDmgCounter < 0) {
        currentPlayer.fighter.armorHead.criticalDmg += 5;
      }
    }

    if (attackingFighter.fighter.attack ===
      currentPlayer.fighter.armorTorso.protec) {
      currentPlayer.fighter.armorTorso.criticalDmgCounter -= 1;

      if (currentPlayer.fighter.armorTorso.criticalDmgCounter < 0) {
        currentPlayer.fighter.armorTorso.criticalDmg += 5;
      }
    }

    if (attackingFighter.fighter.attack ===
      currentPlayer.fighter.armorArms.protec) {
      currentPlayer.fighter.armorArms.criticalDmgCounter -= 1;

      if (currentPlayer.fighter.armorArms.criticalDmgCounter < 0) {
        currentPlayer.fighter.armorArms.criticalDmg += 5;
      }
    }

    if (attackingFighter.fighter.attack ===
      currentPlayer.fighter.armorLegs.protec) {
      currentPlayer.fighter.armorLegs.criticalDmgCounter -= 1;

      if (currentPlayer.fighter.armorLegs.criticalDmgCounter < 0) {
        currentPlayer.fighter.armorLegs.criticalDmg += 5;
      }
    }

    return currentPlayer;
  }

  
  // // NEW
  // private getFighter(userId: string) {
  //   if (userId === this.playerOneId) {
  //     return this.playerOne;
  //   }
  //   if (userId === this.playerTwoId) {
  //     return this.playerTwo;
  //   }
  // }

  // PAKEISTA
  // public assignAttack(playerId: string, bodyPart: string) {
  //   if (playerId === this.playerOneId) {
  //     this.playerOne.fighter.attack = bodyPart;
  //     console.log('playerOne attack: ' + bodyPart);
  //   }
  //   if (playerId === this.playerTwoId) {
  //     this.playerTwo.fighter.attack = bodyPart;
  //     console.log('playerTwo attack: ' + bodyPart);
  //   }
  // }

  // PAKEISTA
  // public assignDefence(playerId: string, bodyPart: string) {
  //   if (playerId === this.playerOneId) {
  //     this.playerOne.fighter.defence = bodyPart;
  //     console.log('playerOne defence: ' + bodyPart);
  //   }
  //   if (playerId === this.playerTwoId) {
  //     this.playerTwo.fighter.defence = bodyPart;
  //     console.log('playerTwo defence: ' + bodyPart);
  //   }
  // }
  
  // PAKEISTA
  // public assignWeapon(playerId: string, weaponId: string, oneHanded: boolean) {
  //   if (playerId === this.playerOneId) {
  //     if (oneHanded) {
  //       this.playerOne.fighter.weaponRight = this.getOneHandedWeapon(weaponId);
  //       console.log('playerOne: Assign weaponRight');
  //     } else {
  //       this.playerOne.fighter.weaponLeft = this.getTwoHandedWeapon(weaponId);
  //       this.playerOne.fighter.weaponRight = this.getTwoHandedWeapon(weaponId);
  //       console.log('playerOne: Assign weaponLeft');
  //     }
  //   }

  //   if (playerId === this.playerTwoId) {
  //     if (oneHanded) {
  //       this.playerTwo.fighter.weaponRight = this.getOneHandedWeapon(weaponId);
  //       console.log('playerTwo: Assign weaponRight');
  //     } else {
  //       this.playerTwo.fighter.weaponLeft = this.getTwoHandedWeapon(weaponId);
  //       this.playerTwo.fighter.weaponRight = this.getTwoHandedWeapon(weaponId);
  //       console.log('playerTwo: Assign weaponLeft');
  //     }
  //   }

  // }

  // private getOneHandedWeapon(id: string): IWeapon {
  //   for (const weapon of this._weaponry.oneHanded) {
  //     if (weapon.id === id) {
  //       return weapon;
  //     }
  //   }
  // }

  // private getTwoHandedWeapon(id: string): IWeapon {
  //   for (const weapon of this._weaponry.twoHanded) {
  //     if (weapon.id === id) {
  //       return weapon;
  //     }
  //   }
  // }

  // PAKEISTA
  // public assignArmor(playerId: string, armorId: string, protec: string) {
  //   if (playerId === this.playerOneId) {

  //     if (protec === 'head') {
  //       this.playerOne.fighter.armorHead = this.getHeadArmor(armorId);
  //       console.log('playerOne: Head armor assigned');
  //     }
  //     if (protec === 'torso') {
  //       this.playerOne.fighter.armorTorso = this.getTorsoArmor(armorId);
  //       console.log('playerOne: Torso armor assigned');
  //     }
  //     if (protec === 'arms') {
  //       this.playerOne.fighter.armorArms = this.getArmsArmor(armorId);
  //       console.log('playerOne: Arms armor assigned');
  //     }
  //     if (protec === 'legs') {
  //       this.playerOne.fighter.armorLegs = this.getLegsArmor(armorId);
  //       console.log('playerOne: Leg armor assigned');
  //     }
  //   }

  //   if (playerId === this.playerTwoId) {

  //     if (protec === 'head') {
  //       this.playerTwo.fighter.armorHead = this.getHeadArmor(armorId);
  //       console.log('playerTwo: Head armor assigned');
  //     }
  //     if (protec === 'torso') {
  //       this.playerTwo.fighter.armorTorso = this.getTorsoArmor(armorId);
  //       console.log('playerTwo: Torso armor assigned');
  //     }
  //     if (protec === 'arms') {
  //       this.playerTwo.fighter.armorArms = this.getArmsArmor(armorId);
  //       console.log('playerTwo: Arms armor assigned');
  //     }
  //     if (protec === 'legs') {
  //       this.playerTwo.fighter.armorLegs = this.getLegsArmor(armorId);
  //       console.log('playerTwo: Leg armor assigned');
  //     }
  //   }

  // }

  // private getHeadArmor(id: string): IArmor {
  //   for (const armor of this._armory.head) {
  //     if (armor.id === id) {
  //       return armor;
  //     }
  //   }
  // }

  // private getTorsoArmor(id: string): IArmor {
  //   for (const armor of this._armory.torso) {
  //     if (armor.id === id) {
  //       return armor;
  //     }
  //   }
  // }

  // private getArmsArmor(id: string): IArmor {
  //   for (const armor of this._armory.arms) {
  //     if (armor.id === id) {
  //       return armor;
  //     }
  //   }
  // }

  // private getLegsArmor(id: string): IArmor {
  //   for (const armor of this._armory.legs) {
  //     if (armor.id === id) {
  //       return armor;
  //     }
  //   }
  // }

}
