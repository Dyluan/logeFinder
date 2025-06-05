import { Component } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor (
    private mainService: MainService, 
    private authService: AuthService,
  ) {}

  userProfile: any;

  get isLoggedIn() {
    return !!this.authService.identityClaims;
  }

  ngOnInit(): void {
      if (this.authService.identityClaims) {
        this.authService.userProfile.subscribe((profile) => {
          this.userProfile = profile;
        })
      }
  }

  login() {
    this.authService.login();
  }
  logout() {
    this.authService.logout();
  }
  
  onClick() {
    this.mainService.navigateHome();
  }
}
