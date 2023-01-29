import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private static readonly themes = [
        'world-1-theme',
        'world-2-theme',
        'world-3-theme',
        'world-4-theme',
        'world-5-theme',
        'world-6-theme',
        'world-7-theme',
        'world-8-theme',
        'world-9-theme',
        'world-10-theme',
        'world-11-theme',
        'world-12-theme',
        'world-13-theme',
        'world-14-theme',
        'world-15-theme',
        'world-16-theme',
        'world-17-theme',
        'world-18-theme',
        'world-19-theme',
    ];
    private theme: string = '';

    public get current(): string {
        return this.theme;
    }

    private themeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('default-theme');
    public get theme$(): Observable<string> {
        return this.themeSubject.asObservable();
    }

    constructor() {}

    public getThemes() {
        return ThemeService.themes;
    }

    public set(theme: string) {
        this.theme = theme;
        this.themeSubject.next(this.theme);
    }
}
