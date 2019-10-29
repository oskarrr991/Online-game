import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INews } from '../models/news.model';

@Injectable()
export class NewsService {
  constructor(private afs: AngularFirestore) { }

  addArticle(newsDetails): void {
    this.afs.collection('news').add(newsDetails);
    console.log('New article created');
  }

  getNewsData(): Observable<INews[]> {
    return this.afs.collection('news').snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as INews;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

  delArticle(id: string): void {
    console.log(id, 'deleted');
    this.afs.collection('news').doc(id).delete();
  }

  updateArticle(id, updatedAuthor, updatedVersion, updatedContent): void {
    this.afs.collection('news').doc(id).update({ author: updatedAuthor });
    this.afs.collection('news').doc(id).update({ version: updatedVersion });
    this.afs.collection('news').doc(id).update({ content: updatedContent });
  }

  getNews() {
    return this.afs.collection('news', ref => ref.orderBy('version')).valueChanges();
  }
}
