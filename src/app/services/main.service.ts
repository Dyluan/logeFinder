import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor() { }

  private route = new Router;

  navigateHome() {
    this.route.navigate(['/home']);
  }
  navigateToDetails(id: string) {
    this.route.navigate(['/item', id]);
    //permet de remettre la page en haut
    window.scrollTo(0, 0);
  }
}
