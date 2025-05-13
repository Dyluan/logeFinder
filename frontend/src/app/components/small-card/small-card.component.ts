import { Component, input } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-small-card',
  imports: [],
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.css'
})
export class SmallCardComponent {

  constructor(private mainService: MainService) {}

  newTitle = input<string>('');
  newPrice = input<number>();
  newLocation = input<string>('');
  newId = input<number>();
  newImg = input<string>('');

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
