import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-favoris',
  imports: [
    HeaderComponent,
    SearchBarComponent,
    FooterComponent,
    MenuComponent
  ],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.css'
})
export class FavorisComponent {

  isMenuOpen = false;
  //je devrais probablement définir un type User
  connectedUser: any;

  onHeaderMenuClick() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onMenuCloseClick() {
    this.isMenuOpen = false;
  }

  OnUserConnected(user: any) {
    console.log('favoris user : ', user)
    this.connectedUser = user;
  }

}
