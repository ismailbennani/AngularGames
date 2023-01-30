import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorldComponent } from './new-world.component';

describe('NewGameComponent', () => {
    let component: NewWorldComponent;
    let fixture: ComponentFixture<NewWorldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewWorldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewWorldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
