import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { DialogModule,Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-nifty-bank-stocks-data',
  templateUrl: './nifty-bank-stocks-data.component.html',
  styleUrls: ['./nifty-bank-stocks-data.component.scss']
})
export class NiftyBankStocksDataComponent {
  public totalFFMC: number = 0;
  public stocksData: any[] = [];
  public stockDataSum: any[] = [];
  private stockstopsum: any = {};
  public sectorWisestock: any[] = [];
  public selectedIndustory: string = '';
  public industoryWiseStockVisible: boolean = false;

  constructor(private httpClient: HttpClient) {
    this.startandendOpeartionofAnalysis();
  }

  ngOnInit() {
    this.getBankNiftyStocksData();
  }

  startandendOpeartionofAnalysis() {
    //For Nifty Stocks Today's Data
    setInterval(() => {
      this.getBankNiftyStocksData();
    }, 10000);
  }

  getBankNiftyStocksData() {
    this.httpClient.get<any>(environment.NSE_BankNiftyStocksData)
      .subscribe((data: any) => {
        console.log(data);
        this.totalFFMC = data.metadata.ffmc_sum;
        this.stocksData = [];
        data.data.filter((x: any) => x.symbol != 'NIFTY BANK').forEach((item: any) => {
          this.stocksData.push({
            bankname: item.symbol,
            open: item.open,
            lastPrice: item.lastPrice,
            pChange: item.pChange,
            weightage: (item.ffmc / 1000) / this.totalFFMC,
            perChange30d: item.perChange30d,
            perChange365d: item.perChange365d,
            tradeType: item.open < item.lastPrice ? 'Call' : 'Put'
          });
        });

        this.stocksData = this.stocksData.sort((x: any, y: any) => { return x.weightage - y.weightage }).reverse();
        this.stockDataSum = [];
        this.stockstopsum = {};

        this.stocksData.forEach((item: any, idx: number) => {
          idx = idx + 1;
          this.stockstopsum = {
            title: 'Top ' + idx,
            weightage_sum: parseFloat(item.weightage + (!this.stockstopsum.weightage_sum ? 0 : this.stockstopsum.weightage_sum)),
            pChange_sum: parseFloat(item.pChange + (!this.stockstopsum.pChange_sum ? 0 : this.stockstopsum.pChange_sum)),
            tradeType: (this.stockstopsum.pChange_sum > 0 ? 'Call' : 'Put')
          }

          if (idx % 4 == 0) {
            this.stockDataSum.push(this.stockstopsum);
          }
        });
      });
  }

}
