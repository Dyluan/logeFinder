import { Component } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-login',
  imports: [
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor (private mainService: MainService) {}
  
  onClick() {
    this.mainService.navigateHome();
  }
}
