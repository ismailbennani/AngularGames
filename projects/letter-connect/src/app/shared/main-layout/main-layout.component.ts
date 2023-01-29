import { Component, isDevMode } from '@angular/core';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
    public get canReset() {
        return isDevMode();
    }

    public reset() {
        localStorage.clear();
        location.replace('/');
    }
}
