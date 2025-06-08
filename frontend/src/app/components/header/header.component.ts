import { Component, Output, EventEmitter, output, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private mainService: MainService, private authService: AuthService) {}

  get userProfile() {
    return this.authService.getUserProfile();
  }

  ngOnInit(): void {
    if (this.authService.identityClaims) {
      this.authService.userProfile.subscribe((profile) => {
        this.connectedUser.emit(profile);
      })

    }
  }

  // userProfile: any;

  // ngOnInit(): void {
  //     if (this.authService.identityClaims) {
  //       this.authService.userProfile.subscribe((profile) => {
  //         this.userProfile = profile;
  //         console.log('Userprofile : ', profile)
  //       })
  //     }
  // }

  connectedUser = output<any>();

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
