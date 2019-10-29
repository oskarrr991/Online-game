import { IWeapon } from '../models/weapon.model';

export class Weaponry {

    oneHanded: IWeapon[] = [{
        name: 'Fists',
        id: '0',
        damage: 10,
        oneHanded: true,
        image: '/assets/images/weapons/knuckles.svg'
    },
    {
        name: 'Dagger',
        id: '1',
        damage: 20,
        oneHanded: true,
        image: 'dagger.svg'
    }];

    twoHanded: IWeapon[] = [{
        name: 'Flail',
        id: '2',
        damage: 30,
        oneHanded: false,
        image: 'club.svg'
    },
    {
        name: 'Sword',
        id: '3',
        damage: 40,
        oneHanded: false,
        image: 'sword.svg'
    }];

// Iš kur mes get'inam? Dabar tipo iš šitų array? O vėliau iš DB? Kokia šitų getų paskirtis?
    get oneHandedWeapon(): IWeapon[] {
        return this.oneHanded;
    }

    get twoHandedWeapon(): IWeapon[] {
        return this.twoHanded;
    }
}
