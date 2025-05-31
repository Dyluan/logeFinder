import { AuthConfig } from 'angular-oauth2-oidc';

interface MyAuthConfig extends AuthConfig {
  usePkce?: boolean;
}

export const authCodeFlowConfig: MyAuthConfig = {
    // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

    // URL of the SPA to redirect the user to after login
  // redirectUri: window.location.origin + '/index.html',
  redirectUri: window.location.origin,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
  clientId: '356307241256-n22vluvf11ff27ne5smq0erh5vpcsq90.apps.googleusercontent.com',

  ////////////////////////////////////////////////////////////////////////
  //responseType :: à changer en prod. ne fonctionnera probablement plus//
  ////////////////////////////////////////////////////////////////////////
  // responseType: 'code',
  strictDiscoveryDocumentValidation: false,

  scope: 'openid profile email',
  
  usePkce: true,

  showDebugInformation: true,
};