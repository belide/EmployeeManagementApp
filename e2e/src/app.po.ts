import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getAppNavBarText() {
    return element(by.css('app-navbar .container .navbar-brand')).getText();
  }
}