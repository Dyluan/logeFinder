import { Component, output } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-search-bar',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    FormsModule,
    InputNumberModule,
    MultiSelectModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  searchValue: string = '';

  onclick() {
    const filters: any = {}

    if (this.selectedPrice) {
      filters.maxPrice = this.selectedPrice;
    }
    if (this.selectedCity && this.selectedCity.length > 0) {
      filters.city = this.selectedCity.map(city => city.name);
    }
    if (this.selectedType?.name) {
      filters.type_location = this.selectedType.name;
    }
    if (this.selectedNumberOfRooms?.name) {
      filters.minRooms = this.selectedNumberOfRooms.name;
    }
    if (this.selectedTypeBien?.name) {
      filters.type_bien = this.selectedTypeBien.name;
    }
    if (this.selectedSurface) {
      filters.minSurface = this.selectedSurface;
    }
    if (this.selectedGarage?.name) {
      filters.garage = this.selectedGarage.name;
    }
    if (this.selectedTri?.name) {
      filters.tri = this.selectedTri.name;
    }
    if (this.searchValue) {
      filters.textSearch = this.searchValue;
    }

    this.outputFilter.emit(filters);
  }

  // tri
  outputFilter = output<{}>();

  selectedCity: {name: string}[] = [];
  selectedType: any;
  selectedPrice: any;
  selectedNumberOfRooms: any;
  selectedTypeBien: any;
  selectedGarage: any;
  selectedSurface: any;
  selectedTitle: any;
  selectedTri: any;

  tri = [
    {name: 'Prix croissant'},
    {name: 'Prix décroissant'},
    {name: 'Superficie croissant'},
    {name: 'Superficie décroissant'},
    {name: 'Nb chambres croissant'},
    {name: 'Nb chambres décroissant'}
  ]
  garage = [
    {name: 'Oui'},
    {name: 'Non'}
  ]
  type_bien = [
    {name: 'Maison'},
    {name: 'Appartement'},
    {name: 'Villa'}
  ]
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
