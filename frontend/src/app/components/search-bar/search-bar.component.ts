import { Component } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { AppartmentService } from '../../services/appartment.service';

@Component({
  selector: 'app-search-bar',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    FormsModule,
    InputNumberModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  constructor(private appartmentService: AppartmentService) {}

  onclick() {
    const filters: any = {}

    if (this.selectedPrice) {
      filters.maxPrice = this.selectedPrice;
    }
    if (this.selectedCity?.name) {
      filters.city = this.selectedCity.name;
    }
    if (this.selectedType?.name) {
      filters.type_location = this.selectedType.name;
    }
    if (this.selectedNumberOfRooms?.name) {
      filters.minRooms = this.selectedNumberOfRooms.name;
    }

    this.appartmentService.searchAppartments(filters).subscribe({
      next: (results) => {
        console.log('Résultats reçus : ' + results);
        // traiter les données reçues ici
      },
      error: (err) => {
        console.log('Erreur lors de la recherche. ', err);
      }
    })
  }
  // minSurface?: number;

  selectedCity: any;
  selectedType: any;
  selectedPrice: any;
  selectedNumberOfRooms: any;

  number_of_rooms = [
    {name: '1'},
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'},
    {name: '7'},
    {name: '8'},
    {name: '9'},
    {name: '10'}
  ];
  type_annonce = [
    {name: 'Vente'},
    {name: 'Location'}
  ];
  // should be able to select multiple cities
  cities = [
    {name: 'Anderlecht'},
    {name: 'Auderghem'},
    {name: 'Bruxelles'},
    {name: 'Schaerbeek'},
    {name: 'Ixelles'},
    {name: 'Etterbeek'},
    {name: 'Evere'},
    {name: 'Forest'},
    {name: 'Ganshoren'},
    {name: 'Koekelberg'},
    {name: 'Molenbeek'},
    {name: 'Saint-Gilles'},
    {name: 'Neder-over-Heembeek'},
    {name: 'Laeken'},
    {name: 'Haren'},
    {name: 'Jette'},
    {name: 'Uccle'},
    {name: 'Watermael-Boitsfort'}
  ]
}
