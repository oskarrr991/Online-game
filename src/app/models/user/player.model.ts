import { IArmor, IWeapon, IFighter } from '../index';

export interface IPlayer {
    uid?: string;
    email: string;
    displayName: string;
    photoURL: string;
    online: boolean;
    emailVerified: boolean;
    room: number;
    weaponRight: Array<IWeapon>;
    weaponLeft: Array<IWeapon>;
    armorHead: Array<IArmor>;
    armorTorso: Array<IArmor>;
    armorArms: Array<IArmor>;
    armorLegs: Array<IArmor>;
    fighter: IFighter;
}
