import { Component } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-small-card',
  imports: [],
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.css'
})
export class SmallCardComponent {

  constructor(private mainService: MainService) {}

  title = 'Large 4 room appartment with nice terrace';
  price = '1,200,000';
  location = 'Saint-Gilles';
  id = '4';

  navigateToDetails() {
    // this.route.navigate(['/item', this.id]);
    this.mainService.navigateToDetails(this.id);
  }
}
