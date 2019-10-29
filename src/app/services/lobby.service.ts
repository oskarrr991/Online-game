import { IRoom } from './../models/room.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LobbyService {

  constructor(private afs: AngularFirestore) { }


  public updateRoom(roomId: string, data: IRoom): Promise<void> {
    return this.afs.collection('rooms').doc(roomId).update(data);
  }

  public getRoom(roomId: string): Observable<any> {
    return this.afs.collection('rooms').doc(roomId).valueChanges();
  }

  public getRooms(): Observable<any[]> {
    return this.afs.collection('rooms').snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IRoom;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

}
