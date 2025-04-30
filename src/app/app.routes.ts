import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PaymentComponent } from './components/payment/payment.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },  // Default route
    {path:"home", component:HomeComponent},
    { path: "pricing", component: PricingComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'payment', component: PaymentComponent },
    { path: '**', component: NotfoundComponent },
    {path:"", redirectTo: 'home', pathMatch:'full'},
];
