import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum ScreenSize {
  Default,
  Medium,
  Small,
}

@Injectable({
  providedIn: 'root',
})
export class Globals {
  private _screenSize: ScreenSize | undefined;
  private _menuCollapsed = true;

  private readonly _screenSizeSubject: Subject<ScreenSize>;
  private readonly _screenSize$: Observable<ScreenSize>;

  private readonly _isMenuCollapsedSubject: Subject<boolean>;
  private readonly _isMenuCollapsed$: Observable<boolean>;

  constructor() {
    this._screenSizeSubject = new Subject<ScreenSize>();
    this._screenSize$ = this._screenSizeSubject.asObservable();

    this._isMenuCollapsedSubject = new Subject<boolean>();
    this._isMenuCollapsed$ = this._isMenuCollapsedSubject.asObservable();

    this.setScreenSize(window.innerWidth);
  }

  public get getScreenSize(): Observable<ScreenSize> {
    return this._screenSize$;
  }

  public collapseMenu(collapse = true) {
    this._menuCollapsed = collapse;
    this._isMenuCollapsedSubject.next(collapse);
  }

  public get menuCollapsed(): boolean {
    return this._menuCollapsed;
  }

  public get isMenuCollapsed(): Observable<boolean> {
    return this._isMenuCollapsed$;
  }

  public get screenSize(): ScreenSize | undefined {
    return this._screenSize;
  }

  public setScreenSize(newSizePixels: number) {
    if (newSizePixels > 768) {
      this._screenSize = ScreenSize.Default;
    } else if (newSizePixels > 576) {
      this._screenSize = ScreenSize.Medium;
    } else {
      this._screenSize = ScreenSize.Small;
    }
    this._screenSizeSubject.next(this.screenSize!);
  }
}
