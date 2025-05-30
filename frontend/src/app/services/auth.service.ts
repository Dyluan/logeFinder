import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../auth.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private OAuthService: OAuthService, private http: HttpClient) {
    this.configure();
  }

  private configure() {
    this.OAuthService.configure(authCodeFlowConfig);
    this.OAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.OAuthService.initLoginFlow();
  }

  logout() {
    this.OAuthService.logOut();
  }

  get identityClaims() {
    return this.OAuthService.getIdentityClaims();
  }

  get accesToken() {
    return this.OAuthService.getAccessToken();
  }

  get userProfile() {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    return this.http.get(url, {
      headers: {
        Authorization: `Bearer ${this.accesToken}`
      }
    })
  }
}
