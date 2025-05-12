import { Component, Input, input, output, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  imports: [
    CommonModule
  ],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  
  @Input() images: string[] = [];
  // images = input<string[]>([]);
  @Input() currentIndex: number = 0;
  // currentIndex = input<number>(0);
  @Input() isOpen: boolean = false;
  // isOpen = input<boolean>(false);
  @Output() close = new EventEmitter<void>();
  // close = output<void>();

  currentImage: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentIndex'] || changes['images']) {
      this.updateCurrentImage();
    }
  }

  private updateCurrentImage() {
    if (this.images && this.images.length > 0) {
      this.currentImage = this.images[this.currentIndex];
    }
  }

  openModal(index: number) {
    this.currentIndex = index;
    this.currentImage = this.images[this.currentIndex];
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }
  previousImage() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
    this.currentImage = this.images[this.currentIndex];
  }
  nextImage() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
    this.currentImage = this.images[this.currentIndex];
  }
}
