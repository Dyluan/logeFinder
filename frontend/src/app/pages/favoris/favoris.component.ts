import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { AppartmentService } from '../../services/appartment.service';
import { Appartement } from '../../models/appartement';
import { LoginService } from '../../services/login.service';

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

  constructor(
    private appartmentService: AppartmentService,
    private loginService: LoginService
    ) {}

  appartments: Appartement[] = [];
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
    this.connectedUser = user;

    if (user && user.email) {
      this.loginService.getUserId(user.email).subscribe((id) => {
        this.appartmentService.getFavorites(id).subscribe((appartements) => {
          this.appartments = appartements;
          console.log(appartements);
        })
      })
    }
  }

}
