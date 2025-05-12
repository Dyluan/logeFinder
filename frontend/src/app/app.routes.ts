import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ItemComponent } from './pages/item/item.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePageComponent,
    },
    {
        path: 'item',
        component: ItemComponent,
    },
    {
        path: 'item/:id',
        component: ItemComponent,
    },
];