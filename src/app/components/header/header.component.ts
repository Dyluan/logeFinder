import { Component, Output, EventEmitter } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private mainService: MainService) {}

  @Output() menuClicked = new EventEmitter<void>();

  onMenuClick() {
    this.menuClicked.emit();
  }

  navigateHome() {
    this.mainService.navigateHome();
  }
}
