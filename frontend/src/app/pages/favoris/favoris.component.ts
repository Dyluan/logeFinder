import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { AppartmentService } from '../../services/appartment.service';
import { Appartement } from '../../models/appartement';

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
export class FavorisComponent implements OnInit {

  constructor(private appartmentService: AppartmentService) {}

  appartments: Appartement[] = [];
  isMenuOpen = false;
  //je devrais probablement définir un type User
  connectedUser: any;

  ngOnInit(): void {
    this.appartmentService.getFavorites(this.connectedUser.email).subscribe((appartments) => {
      this.appartments = appartments;
    })
  }

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
