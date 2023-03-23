import { Component, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public allIndicesData: any[] = [];
  public nifty50IndicesData: any[] = [];
  public sectorialIndicesData: any[] = [];
  public thematicIndicesData: any[] = [];
  public nifty50CurPrice: number = 0;
  public niftyBankCurPrice: number = 0;
  public niftyFINCurPrice: number = 0;
  public indiaVIXCurPrice: number = 0;
  public rangeofNiftyIndex: any[] = [];

  private indiaVIXfor: any[] = [
    {
      name: 'Day',
      value: 250
    },
    {
      name: 'week',
      value: 52
    },
    {
      name: 'Month',
      value: 12
    },
  ]

  private indicesList: string[] = [
    'NIFTY 50',
    'NIFTY MIDCAP 50',
    'NIFTY SMALLCAP 50',
    'INDIA VIX'
  ];

  private sectorialIndicesList: string[] = [
    'NIFTY BANK',
    'NIFTY AUTO',
    'NIFTY FINANCIAL SERVICES',
    'NIFTY FMCG',
    'NIFTY IT',
    'NIFTY MEDIA',
    'NIFTY METAL',
    'NIFTY PHARMA',
    'NIFTY PSU BANK',
    'NIFTY PRIVATE BANK',
    'NIFTY REALTY',
    'NIFTY HEALTHCARE INDEX',
    'NIFTY CONSUMER DURABLES',
    'NIFTY OIL & GAS'
  ];

  private thematicIndicesList: string[] = [
    'NIFTY COMMODITIES',
    'NIFTY INDIA CONSUMPTION',
    'NIFTY CPSE',
    'NIFTY ENERGY',
    'NIFTY INFRASTRUCTURE',
    'NIFTY INDIA DIGITAL'
  ]

  constructor(private httpClient: HttpClient) {
    this.getAllIndices();
  }

  ngOnInit() {
    setInterval(() => {
      this.getAllIndices();
    }, 60000)
  }

  getAllIndices() {
    this.httpClient.get<any>(environment.ALLIndices)
      .subscribe(
        (data: any) => {
          this.allIndicesData = data.data;

          this.nifty50IndicesData = [];
          this.indicesList.forEach((index: any) => {
            this.nifty50IndicesData.push(this.allIndicesData.find((item: any) => item.index == index));
          })

          this.sectorialIndicesData = [];
          this.sectorialIndicesList.forEach((index: any) => {
            this.sectorialIndicesData.push(this.allIndicesData.find((item: any) => item.index == index));
          })

          this.thematicIndicesData = [];
          this.thematicIndicesList.forEach((index: any) => {
            this.thematicIndicesData.push(this.allIndicesData.find((item: any) => item.index == index));
          })

          this.nifty50CurPrice = this.allIndicesData.find((x: any) => x.index == 'NIFTY 50').last;
          this.niftyBankCurPrice = this.allIndicesData.find((x: any) => x.index == 'NIFTY BANK').last;
          this.niftyFINCurPrice = this.allIndicesData.find((x: any) => x.index == 'NIFTY FINANCIAL SERVICES').last;
          this.indiaVIXCurPrice = this.allIndicesData.find((x: any) => x.index == 'INDIA VIX').last;

          this.rangeofNiftyIndex = [];
          this.indiaVIXfor.forEach((range: any) => {
            let per = (this.indiaVIXCurPrice/Math.sqrt(range.value));
            let value = (this.nifty50CurPrice * (this.indiaVIXCurPrice/Math.sqrt(range.value)))/100;
            this.rangeofNiftyIndex.push({
              caption: range.name,
              changeper: per,
              chnagerange: value,
              highRange: (this.nifty50CurPrice + value),
              lowRange: (this.nifty50CurPrice - value),
            });
          })

        },
        (error: any) => {

        })
  }
}
