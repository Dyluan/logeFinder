import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { CommonModule } from '@angular/common';
import { Appartement } from '../../models/appartement';

@Component({
  selector: 'app-item',
  imports: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ImageModalComponent,
    CommonModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent  {

  @ViewChild('imageModal') imageModal!: ImageModalComponent;

  imageUrls: string[] = [
    'img/testImg.jpg',
    'img/big.png',
    'img/test2.jpg',
    'img/small3.png',
  ];

  selectedImageIndex: number = 0;

  isMenuOpen = false;
  isModalOpen = false;

  appartement: Appartement = {
    id: 1,
    title: 'Premium penthouse in central Barcelona with panoramic views',
    type: 'Appartement',
    surface: 224,
    ville: 'Saint-Gilles',
    prix: 1200000,
    description: `FEDORS GROUP offers an exclusive FOR SALE elegant large 5-room apartment on Vincent Hložník Street in the Condominium Renaissance residential complex. 
      Thanks to its unique location, the property has access to a large Japanese garden with an area of 35 m2, which can be accessed directly from the bedroom. The front of the apartment is at the height of the third floor, so the terrace is located just above the treetops, which gives the apartment a unique atmosphere. Overall, the apartment has a direct view of the Danube River and the surrounding forests. 
      The apartment offers extraordinary comfort, has a first-class interior from the leading architectural office Cakov Makara and equipment from renowned world furniture manufacturers. The overall atmosphere of the apartment is completed`,
    adresse: 'Vincent Hložník Street',
    nombreChambres: 3,
  }

  //function related to the image modal
  ngAfterViewInit(): void {
      //
  }

  onHeaderMenuClick() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onMenuCloseClick() {
    this.isMenuOpen = false;
  }

  openImageModal(index: number) {
    this.selectedImageIndex = index;
    this.isModalOpen = true;
    setTimeout(() => {
      if (this.imageModal) {
        this.imageModal.openModal(index);
      }
    });
    
  }

  onModalClose() {
    this.isModalOpen = false;
  }
}
