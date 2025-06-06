import { Component, input, output, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AppartmentService } from '../../services/appartment.service';

interface FavoriteEvent {
  isFavorite: boolean;
  itemId: any;
}

@Component({
  selector: 'app-small-card',
  imports: [],
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.css'
})
export class SmallCardComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private appartmentService: AppartmentService,
  ) {}

  ngOnInit(): void {
    // vérifier si l'item est un favori pour l'utilisateur
      if (this.newId()) {
        this.appartmentService.isFavorite(this.newId()!).subscribe(
          isFavorite => {
            this.isFavoriteIconClicked = isFavorite;
            this.favoriteIconSrc = isFavorite ? '/img/favori.png' : '/img/notFavori.png';
          }
        );
      }
  }

  newTitle = input<string>('');
  newPrice = input<number>();
  newLocation = input<string>('');
  newId = input<number>();
  newImg = input<string>('');

  isFavoriteIconClicked: boolean = false;
  isItemAddedToFavorite = output<FavoriteEvent>();

  favoriteIconSrc: string = '/img/notFavori.png';

  onClick() {
    this.isFavoriteIconClicked = !this.isFavoriteIconClicked;
    if (this.isFavoriteIconClicked) {
      this.favoriteIconSrc = '/img/favori.png';
      this.isItemAddedToFavorite.emit({
        isFavorite: true,
        itemId: this.newId()
      });
    }
    else {
      this.favoriteIconSrc = '/img/notFavori.png';
      this.isItemAddedToFavorite.emit({
        isFavorite: false,
        itemId: this.newId()
      });
    }
  }

  navigateToDetails() {
    // this.route.navigate(['/item', this.id]);
    if (this.newId() === undefined || this.newId() === null) {
      console.error('ID is undefined');
      return;
    }
    //navigateToDetails is a method that takes a string as an argument
    let tempID = this.newId()!.toString();
    this.mainService.navigateToDetails(tempID);
  }
}
