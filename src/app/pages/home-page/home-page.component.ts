import { Component } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SmallCardComponent } from '../../components/small-card/small-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-home-page',
  imports: [
    SearchBarComponent,
    SmallCardComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  title = 'Trouver un appartement';
  subtitle = 'Trouvez un appartement à louer ou à vendre';

  isMenuOpen = false;

  onHeaderMenuClick() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onMenuCloseClick() {
    this.isMenuOpen = false;
  }
}
