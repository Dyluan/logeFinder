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
    this.appartmentService.getAppartments().subscribe(
      data => {
        this.appartments = data;
        this.areDataLoaded = true;
        // console.log('oninit' , this.appartments);
      }
    )
  };

  onFilterChange(filters: any) {
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
    console.log('connected user : ', user)
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
    }
  }

}
