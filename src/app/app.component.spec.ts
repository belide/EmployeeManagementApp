import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpClientModule } from '@angular/common/http';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent
      ],
      imports: [ RouterTestingModule ,FlashMessagesModule.forRoot(),HttpClientModule]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'empManagement'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('empManagement');
  }));
});