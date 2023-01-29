import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TitleService {
    private title: string = '';

    public get current(): string {
        return this.title;
    }

    private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public get title$(): Observable<string> {
        return this.titleSubject.asObservable();
    }

    constructor() {}

    public set(title: string) {
        this.title = title;
        this.titleSubject.next(this.title);
    }
}
