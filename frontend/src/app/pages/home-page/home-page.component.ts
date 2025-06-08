import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SmallCardComponent } from '../../components/small-card/small-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { AppartmentService } from '../../services/appartment.service';
import { Appartement } from '../../models/appartement';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

interface FavoriteEvent {
  isFavorite: boolean;
  itemId: any;
}

@Component({
  selector: 'app-home-page',
  imports: [
    SearchBarComponent,
    SmallCardComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  appartments: Appartement[] = [];
  areDataLoaded: boolean = false;
  connectedUser: any;

  constructor(
    private appartmentService: AppartmentService,
    private loginService: LoginService
    ) {}

  ngOnInit() {
    let filters = JSON.parse(localStorage.getItem('filters') || '{}');
    if (Object.keys(filters).length === 0) {
      // si mes filtres précédents sont vides, j'appelle la fonction basique getAppartments()
      this.appartmentService.getAppartments().subscribe(
        data => {
          this.appartments = data;
          this.areDataLoaded = true;
        }
      )
      // sinon, j'appelle la fonction searchApparments selon les filtres précédents
    } else {
      this.appartmentService.searchAppartments(filters).subscribe({
      next: (data) => {
        this.appartments = data;
        this.areDataLoaded = true;
      },
      error: (err) => {
        console.log('Erreur lors de la recherche. ', err);
      }
      })
    }
  };

  onFilterChange(filters: any) {
    //localStorage enregistre les filtres appliqués dans une variable filters
    //pour empêcher qu'ils soient reset lorsqu'on navigue sur une autre page
    localStorage.setItem('filters', JSON.stringify(filters));
    this.appartmentService.searchAppartments(filters).subscribe({
      next: (data) => {
        console.log('Résultats reçus : ' + data.length);
        this.appartments = data;
        this.areDataLoaded = true;
      },
      error: (err) => {
        console.log('Erreur lors de la recherche. ', err);
      }
    })
  }

  title = 'Trouver un appartement';
  subtitle = 'Trouvez un appartement à louer ou à vendre';

  isMenuOpen = false;

  onHeaderMenuClick() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onMenuCloseClick() {
    this.isMenuOpen = false;
  }

  OnUserConnected(user: any) {
    this.connectedUser = user;

    if (user && user.email) {
      this.loginService.isUserRegistered(user.email).subscribe({
        next: (exists: boolean) => {
          if (exists) {
            console.log('Utilisateur déjà présent dans la BDD');
          }
          else {
            console.log('Utilisateur pas encore enregistré dans la BDD');
            this.loginService.registerThisUser(user.email, user.given_name).subscribe((_) => {
              console.log('Utilisateur enregistré :)');
            })
          }
        },
        error: (error) => {
          console.log('Erreur lors du user check', error);
        }
      })
      // ajoute le userId dans le localhost pour ne pas avoir à appeler les fonctions 1000 fois
      this.loginService.getUserId(this.connectedUser.email).subscribe((data) => {
        localStorage.setItem('userId', data);
        // console.log('userId', data);
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

}
