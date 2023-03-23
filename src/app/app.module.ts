import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Holidays } from './modals/holidays';
import { SortPipe } from './shared/pipes/sort.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NiftyDataComponent } from './nifty-data/nifty-data.component';
import { BankNiftyDataComponent } from './bank-nifty-data/bank-nifty-data.component';
import { NiftyStocksDataComponent } from './nifty-stocks-data/nifty-stocks-data.component';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NiftyBankStocksDataComponent } from './nifty-bank-stocks-data/nifty-bank-stocks-data.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    NiftyDataComponent,
    BankNiftyDataComponent,
    NiftyStocksDataComponent,
    NiftyBankStocksDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DialogModule,
    BrowserAnimationsModule
  ],
  providers: [Holidays, SortPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
