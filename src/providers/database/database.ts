import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class DatabaseProvider {

  constructor(public db:AngularFireDatabase) {
  }

  getObject(path: string): Observable<any> {
    const ref = this.db.object(path);
    return ref.valueChanges();
  }

  setObject(path: string, data: any): Promise<void> {
    const ref = this.db.object(path);
    return ref.set(data);
  }

  updateObject(path: string, data: any): Promise<void> {
    const ref = this.db.object(path);
    return ref.update(data);
  }

  removeObject(path: string): Promise<void> {
    const ref = this.db.object(path);
    return ref.remove();
  }

}
