import { Component, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { CommonModule } from '@angular/common';
import { Appartement } from '../../models/appartement';
import { AppartmentService } from '../../services/appartment.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

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
export class ItemComponent implements OnInit {

  constructor(private appartmentService: AppartmentService) {}
  
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  
  id!: number | null;
  appartment!: Appartement;

  googleSrc: string = '';
  realUrl: SafeResourceUrl = '';
  googleMapsApi: string = environment.googleMapsApiKey;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let tempId = params.get('id');
      this.id = parseInt(tempId!);
    });
    this.appartmentService.getAppartmentById(this.id!).subscribe(
      data => {
        this.appartment = data;
        this.googleSrc = 'https://www.google.com/maps/embed/v1/place?key='+this.googleMapsApi+'&q='+this.appartment.adresse+','+this.appartment.ville;
        this.realUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleSrc);
        console.log('oninit' , this.appartment);
      }
    )
    
  }

  @ViewChild('imageModal') imageModal!: ImageModalComponent;

  //need to load those images from the server as well
  imageUrls: string[] = [
    'img/testImg.jpg',
    'img/big.png',
    'img/test2.jpg',
    'img/small3.png',
  ];

  selectedImageIndex: number = 0;

  isMenuOpen = false;
  isModalOpen = false;

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
