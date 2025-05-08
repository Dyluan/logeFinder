import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
    @Output() closeMenu = new EventEmitter<void>();

    onCloseMenuClick() {
      this.closeMenu.emit();
    }
}
