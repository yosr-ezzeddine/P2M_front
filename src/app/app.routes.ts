import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

export const routes: Routes = [
    {path:"home", component:HomeComponent},
    {path:"pricing", component:PricingComponent},
    { path: '**', component: NotfoundComponent },
    {path:"", redirectTo: 'home', pathMatch:'full'},

];
