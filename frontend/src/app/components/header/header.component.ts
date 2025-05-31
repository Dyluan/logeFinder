import { Component, Output, EventEmitter } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private mainService: MainService, private authService: AuthService) {}

  userProfile: any;

  ngOnInit(): void {
      if (this.authService.identityClaims) {
        this.authService.userProfile.subscribe((profile) => {
          this.userProfile = profile;
          console.log('Userprofile : ', profile)
        })
      }
  }

  get isLoggedIn() {
    return !!this.authService.identityClaims;
  }

  @Output() menuClicked = new EventEmitter<void>();

  onMenuClick() {
    this.menuClicked.emit();
  }

  navigateHome() {
    this.mainService.navigateHome();
  }
}
