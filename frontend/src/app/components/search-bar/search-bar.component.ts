import { Component, output, OnInit } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';

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
export class SearchBarComponent implements OnInit {

  searchValue: string = '';
  currentUrl: string = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    // si searchBar est utilisée dans /favoris, alors charger favoriteFilters stocké dans localStorage
    // sinon, on est dans /home et on charge filters
    const storageFilter = this.currentUrl === '/favoris' ? 'favoriteFilters' : 'filters';
    let filters = JSON.parse(localStorage.getItem(storageFilter) || '{}');
    if (Object.keys(filters).length > 0) {
      if (filters.textSearch) {
          this.searchValue = filters.textSearch;
        }
      // if (filters.city) {
      //   this.selectedCity = Array.isArray(filters.city) 
      //       ? filters.city.map(city => ({ name: city }))
      //       : [{ name: filters.city }];
      // }
      if (filters.type_location) {
        this.selectedType = { name: filters.type_location };
      }
      if (filters.maxPrice) {
        this.selectedPrice = filters.maxPrice;
      }
      if (filters.minRooms) {
        this.selectedNumberOfRooms = { name: filters.minRooms };
      }
      if (filters.type_bien) {
        this.selectedTypeBien = { name: filters.type_bien };
      }
      if (filters.minSurface) {
        this.selectedSurface = filters.minSurface;
      }
      if (filters.garage) {
        this.selectedGarage = { name: filters.garage };
      }
      if (filters.tri) {
        this.selectedTri = { name: filters.tri };
      }
    }
  }

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
