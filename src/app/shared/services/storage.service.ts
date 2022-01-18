import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage;
  private subjects: Map<string, ReplaySubject<any>>;
  private watched: { [key: string]: boolean } = {};

  constructor(storage: Storage) {
    this.storage = storage;
    this.subjects = new Map<string, ReplaySubject<any>>();
  }

  watch(key: string): Observable<any> {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new ReplaySubject<any>(1));
    }
    let item: any = this.storage.getItem(key);
    if (item === undefined) {
      item = undefined;
    } else if (item === null) {
      item = null;
    } else {
      if (!this.watched[key]) {
        this.subjects.get(key)!.next(JSON.parse(item));
        this.watched[key] = true;
      }
    }
    return this.subjects.get(key)!.asObservable();
  }

  get(key: string): any {
    let item: any = this.storage.getItem(key);
    if (item === undefined) {
      item = undefined;
    } else if (item === null) {
      item = null;
    } else {
      item;
    }
    return item;
  }

  set(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new ReplaySubject<any>(1));
    }
    if (!this.watched[key]) {
      this.watched[key] = true;
    }
    this.subjects.get(key)!.next(value);
  }

  remove(key: string) {
    if (this.subjects.has(key)) {
      this.subjects.get(key)!.next(null);
    }
    this.storage.removeItem(key);
  }

  clear() {
    this.subjects.forEach((subj) => {
      subj.next(null);
    });
    this.storage.clear();
  }
}
