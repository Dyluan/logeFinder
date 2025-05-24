import { Component, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Appartement } from '../../models/appartement';
import { AppartmentService } from '../../services/appartment.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-item',
  imports: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    CommonModule,
    GalleriaModule,
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

  galleriaImages: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let tempId = params.get('id');
      this.id = parseInt(tempId!);
    });
    this.appartmentService.getAppartmentById(this.id!).subscribe(data => {
        this.appartment = data;
        this.googleSrc = 'https://www.google.com/maps/embed/v1/place?key='+this.googleMapsApi+'&q='+this.appartment.adresse+','+this.appartment.ville;
        this.realUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleSrc);
        console.log('oninit' , this.appartment);

        this.galleriaImages = (this.appartment.images ?? []).map(url => ({
          itemImageSrc: url,
          thumbnailImageSrc: url
        }));
      }
    )
    
  }

  isMenuOpen = false;

  onHeaderMenuClick() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onMenuCloseClick() {
    this.isMenuOpen = false;
  }

}
