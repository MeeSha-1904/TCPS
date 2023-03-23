import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { DialogModule,Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-nifty-stocks-data',
  templateUrl: './nifty-stocks-data.component.html',
  styleUrls: ['./nifty-stocks-data.component.scss']
})
export class NiftyStocksDataComponent {
  public totalFFMC: number = 0;
  public stocksData: any[] = [];
  public stockDataSum: any[] = [];
  private stockstopsum: any = {};
  public stockDeliveryData: any[] = [];
  public stockDeliveryVisible: boolean = false;
  public industryWeightage: any[] = [];
  public sectorWisestock: any[] = [];
  public selectedIndustory: string = '';
  public industoryWiseStockVisible: boolean = false;

  constructor(private httpClient: HttpClient) {
    this.startandendOpeartionofAnalysis();
  }

  ngOnInit() {
    this.getNiftyStocksData();
  }



  startandendOpeartionofAnalysis() {
    //For Nifty Stocks Today's Data
    setInterval(() => {
      this.getNiftyStocksData();
    }, 10000);
  }

  getNiftyStocksData() {
    this.httpClient.get<any>(environment.NSE_NiftyStocksData)
      .subscribe((data: any) => {
        console.log(data);
        this.totalFFMC = data.metadata.ffmc_sum;
        this.stocksData = [];
        data.data.filter((x: any) => x.symbol != 'NIFTY 50').forEach((item: any) => {
          this.stocksData.push({
            companyname: item.symbol,
            open: item.open,
            lastPrice: item.lastPrice,
            change: item.change,
            pChange: item.pChange,
            weightage: (item.ffmc / 1000) / this.totalFFMC,
            perChange30d: item.perChange30d,
            perChange365d: item.perChange365d,
            tradeType: item.open < item.lastPrice ? 'Call' : 'Put',
            industry: item.meta.industry ?? 'OTHER'
          });
        });

        this.stocksData = this.stocksData.sort((x: any, y: any) => { return x.weightage - y.weightage }).reverse();
        this.industryWeightage = [];
        this.stocksData.forEach((item: any) => {
          let idx = this.industryWeightage.findIndex((iw: any) => { return iw.industry == item.industry; });
          if (idx > -1) {
            this.industryWeightage[idx].weightage = parseFloat(this.industryWeightage[idx].weightage + item.weightage);
            this.industryWeightage[idx].change = parseFloat(this.industryWeightage[idx].change + item.change);
            this.industryWeightage[idx].pChange = parseFloat(this.industryWeightage[idx].pChange + item.pChange);
            this.industryWeightage[idx].perChange30d = parseFloat(this.industryWeightage[idx].perChange30d + item.perChange30d);
            this.industryWeightage[idx].tradeType = (this.industryWeightage[idx].pChange > 0 ? 'Call' : 'Put')
          }
          else {
            this.industryWeightage.push({
              industry: item.industry,
              weightage: item.weightage,
              change: item.change,
              pChange: item.pChange,
              perChange30d: item.perChange30d,
              perChange365d: item.perChange365d,
              tradeType: item.tradeType
            });
          }
        });

        this.industryWeightage = this.industryWeightage.sort((x: any, y: any) => { return x.weightage - y.weightage }).reverse();
        this.stockDataSum = [];
        this.stockstopsum = {};

        this.stocksData.forEach((item: any, idx: number) => {
          idx = idx + 1;
          this.stockstopsum = {
            title: 'Top ' + idx,
            weightage_sum: parseFloat(item.weightage + (!this.stockstopsum.weightage_sum ? 0 : this.stockstopsum.weightage_sum)),
            change_sum: parseFloat(item.change + (!this.stockstopsum.change_sum ? 0 : this.stockstopsum.change_sum)),
            pChange_sum: parseFloat(item.pChange + (!this.stockstopsum.pChange_sum ? 0 : this.stockstopsum.pChange_sum)),
            tradeType: (this.stockstopsum.pChange_sum > 0 ? 'Call' : 'Put')
          }

          if (idx % 10 == 0) {
            this.stockDataSum.push(this.stockstopsum);
          }
        });
      });
  }

  getSectorWiseStockData(industoryname: string) {
    this.sectorWisestock = [];
    this.industoryWiseStockVisible = true;
    this.selectedIndustory = industoryname;
    if (this.stocksData != null) {
      this.stocksData.filter((itm: any) => itm.industry == industoryname).forEach((item: any) => {
        this.sectorWisestock.push({
          companyname: item.companyname,
          open: item.open,
          lastPrice: item.lastPrice,
          change: item.change,
          pChange: item.pChange,
          weightage: item.weightage,
          perChange30d: item.perChange30d,
          perChange365d: item.perChange365d,
          tradeType: item.tradeType
        });
      });
    }
  }

  getStocksDeliveryData(symbol: string, symbolCount: number) {
    this.httpClient
      .get(environment.NSE_StockDeliveryDataUrl + '?symbol=' + symbol + '&segmentLink=3&symbolCount=' + symbolCount + '&series=EQ&dateRange=week&fromDate=&toDate=&dataType=PRICEVOLUMEDELIVERABLE',
        { responseType: 'text' })
      .subscribe(
        (data: any) => {
          this.stockDeliveryData = this.csvToJson(((new DOMParser()).parseFromString(data, 'text/html')).getElementById('csvContentDiv')?.innerHTML);
          this.stockDeliveryVisible = true;
          console.log(this.stockDeliveryData);
        },
        (error: any) => {
          this.getStocksDeliveryData(symbol, 2);
          // alert('error');
        });
  }

  hideDialogBox() {
    this.stockDeliveryVisible = false;
    this.industoryWiseStockVisible = false;
  }

  csvToJson(csv?: string) {
    // \n or \r\n depending on the EOL sequence
    if (csv) {
      csv = csv.replaceAll('"', '').replaceAll(' ', '');
      const lines = csv.split(':');
      const delimeter = ',';

      const result = [];

      const headers = lines[0].replaceAll('.', '').replaceAll('%', '').split(delimeter);

      for (let j = 1; j < lines.length; j++) {
        if (lines[j].length > 0) {
          const obj: any = {};
          const row = lines[j].split(delimeter);

          for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            obj[header] = row[i];
          }

          result.push(obj);
        }
      }

      // Prettify output
      return result;
    }
    return [{}];
  }
}
