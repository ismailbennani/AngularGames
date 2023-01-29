import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-letters',
    templateUrl: './letters.component.html',
    styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit {
    @Input()
    public get letters(): string[] {
        return this._letters;
    }

    public set letters(value: string[]) {
        this._letters = value;
        this.refresh();
    }

    private _letters: string[] = [];

    @Input()
    public get longestWordSize(): number {
        return this._longestWordSize;
    }

    public set longestWordSize(value: number) {
        this._longestWordSize = value;
        this.refresh();
    }

    private _longestWordSize: number = 0;

    @Input()
    public get smallestWordSize(): number {
        return this._smallestWordSize;
    }

    public set smallestWordSize(value: number) {
        this._smallestWordSize = value;
        this.refresh();
    }

    private _smallestWordSize: number = 0;

    @Output()
    public attempt: EventEmitter<string> = new EventEmitter<string>();

    public currentWord: string[] = [];
    public used: boolean[] = [];

    public get cols(): number {
        return !this._letters ? 0 : Math.ceil(this._letters.length / 2);
    }

    public get canClear(): boolean {
        return this.currentWord.filter((l) => l !== '').length > 0;
    }

    public get canTrigger(): boolean {
        return this.currentWord.filter((l) => l !== '').length >= this._smallestWordSize;
    }

    ngOnInit(): void {
        this.refresh();
    }

    public addLetter(letter: string) {
        const notUsedIndex = this._letters.findIndex((l, i) => l == letter.toUpperCase() && !this.used[i]);
        if (notUsedIndex < 0) {
            return;
        }

        this.used[notUsedIndex] = true;

        for (let i = 0; i < this.currentWord.length; i++) {
            if (this.currentWord[i] === '') {
                this.currentWord[i] = letter;
                return;
            }
        }
    }

    public removeLetter(index: number) {
        const letter = this.currentWord[index];
        for (let i = 0; i < this._letters.length; i++) {
            if (this._letters[i] == letter && this.used[i]) {
                this.used[i] = false;
                break;
            }
        }

        this.currentWord.splice(index, 1);
        this.currentWord.push('');
    }

    public triggerAttempt() {
        if (!this.canTrigger) {
            return;
        }

        const word = ''.concat(...this.currentWord);
        this.attempt.emit(word);

        this.clear();
    }

    public clear() {
        this.currentWord.fill('');
        this.used.fill(false);
    }

    private refresh() {
        this.currentWord = new Array<string>(this._longestWordSize).fill('');
        this.used = this._letters.map((_) => false);
    }

    @HostListener('window:keyup', ['$event'])
    private letter(event: KeyboardEvent) {
        const letter = event.key.toUpperCase();

        if (this._letters.includes(letter)) {
            this.addLetter(letter);
        }
    }

    @HostListener('window:keyup.enter', ['$event'])
    private enterPressed(_: KeyboardEvent) {
        this.triggerAttempt();
    }

    @HostListener('window:keyup.escape', ['$event'])
    private escapePressed(_: KeyboardEvent) {
        this.clear();
    }
}
