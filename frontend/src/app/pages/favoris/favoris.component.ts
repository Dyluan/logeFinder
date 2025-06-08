import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { AppartmentService } from '../../services/appartment.service';
import { Appartement } from '../../models/appartement';
import { LoginService } from '../../services/login.service';
import { SmallCardComponent } from '../../components/small-card/small-card.component';

interface FavoriteEvent {
  isFavorite: boolean;
  itemId: any;
}

@Component({
  selector: 'app-favoris',
  imports: [
    HeaderComponent,
    SearchBarComponent,
    FooterComponent,
    MenuComponent,
    SmallCardComponent
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
        })
      })
    }
  }

  OnItemAddedToFavorite(params: FavoriteEvent) {
    let userId;
    //j'appelle la fonctione getUserId pour récupérer l'ID dans la database en fonction de l'email utilisateur
    this.loginService.getUserId(this.connectedUser.email).subscribe((data) => {
      userId = data;
      //j'appelle ma fonction addToFavorites pour rajouter le bien aux favoris de l'utilisateur si l'utilisateur a ajouté le bien a ses favoris
      if (params.isFavorite === true) {
        this.appartmentService.addToFavorites(params.itemId, userId).subscribe((_) => {
          
        });
        console.log('Item ajouté aux favoris');
      }
      //sinon, l'utilisateur supprime le bien de ses favoris
      else if(params.isFavorite === false) {
        // console.log('trying to delete from favorites');
        this.appartmentService.deleteFromFavorites(userId, params.itemId).subscribe((_) => {

        });
        console.log('Item supprimé des favoris');
      }
    });
  }

  onFilterChange(filters: any) {
    console.log('Voici mes filtres:', filters);
    this.appartmentService.searchFavoritesAppartments(filters).subscribe((data) => {
      this.appartments = data;
    })
  }

}
