import { Component } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  onclick() {
    console.log('Search button clicked');
  }

  selectedCity: any;
  selectedType: any;
  type_annonce = [
    {name: 'Vente'},
    {name: 'Location'}
  ]
  cities = [
    {name: 'Auderghem'},
    {name: 'Bruxelles'},
    {name: 'Schaerbeek'}
  ]
}
