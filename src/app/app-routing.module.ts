import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NiftyDataComponent } from './nifty-data/nifty-data.component';
import { BankNiftyDataComponent } from './bank-nifty-data/bank-nifty-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NiftyStocksDataComponent } from './nifty-stocks-data/nifty-stocks-data.component';
import { NiftyBankStocksDataComponent } from './nifty-bank-stocks-data/nifty-bank-stocks-data.component';

const routes: Routes = [
  {path: 'nifty-stocks-data', component: NiftyStocksDataComponent},
  {path: 'nifty-bank-stocks-data', component: NiftyBankStocksDataComponent},
  {path: 'nifty-option-data', component: NiftyDataComponent},
  {path: 'bank-nifty-option-data', component: BankNiftyDataComponent},
  {path: 'dashboard', component: DashboardComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
