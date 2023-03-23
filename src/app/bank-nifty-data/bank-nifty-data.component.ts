import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { ValidateStrategyFormulaService } from '../services/validate-strategy-formula.service';
import { BTSTBNDiff, BTSTBNPutValue, BTSTBNCallValue } from '../modals/btstmodal';
import { environment } from '../../environments/environment.development';
import { BankNiftyData, BankNiftyDiffByLTPData } from '../modals/bankniftydatamodal';


@Component({
  selector: 'app-bank-nifty-data',
  templateUrl: './bank-nifty-data.component.html',
  styleUrls: ['./bank-nifty-data.component.scss']
})
export class BankNiftyDataComponent {
  public btstbnCallValue = new BTSTBNCallValue();
  public btstbnPutValue = new BTSTBNPutValue();
  public btstbnDiff = new BTSTBNDiff();

  public bankniftydata = new BankNiftyData();
  public bankniftyDiffByLTPData = new BankNiftyDiffByLTPData();

  public bankniftyValue: any;
  public bankniftyBuy: string = '';

  private _btstdata: any;
  public optionchaindata: any;
  public optionchain_top16_data_total: any;
  public optionchain_top16_data: any[] = [];
  private _todayDate = new Date();
  private _todayDateInFormat: string = '';
  private selectedTimeZone: number = 60000;

  public btstLastTriggerTime = new Date().toLocaleTimeString();

  constructor(private httpClient: HttpClient, private vsfService: ValidateStrategyFormulaService) {
    this._todayDateInFormat = this.vsfService.createvaliddateformula(this._todayDate);

    this.startandendOpeartionofAnalysis();
  }

  ngOnInit() {
    this.getBankNiftyData();
    this.getOptionData();
  }

  onSelectedTimeZone(value: string) {
    this.selectedTimeZone = parseInt(value) * 60000;
  }

  startandendOpeartionofAnalysis() {
    //For Nifty Today's Data
    setInterval(() => {
      this.getBankNiftyData();
    }, this.selectedTimeZone / 5);

    //For BTST Strategy
    setInterval(() => {
      this.getOptionData();
    }, this.selectedTimeZone);
  }

  getBankNiftyData() {
    // if ((new Date()).getHours() >= 9 && (new Date()).getHours() <= 15) {
    this.getBankNiftyStock();
    // }
  }

  getOptionData() {
    // if ((new Date()).getHours() >= 9 && (new Date()).getHours() <= 15) {
    this.btstLastTriggerTime = new Date().toLocaleTimeString();

    this.btstbnCallValue = new BTSTBNCallValue();
    this.btstbnPutValue = new BTSTBNPutValue();

    this.optionchain_top16_data = [];

    this.getOptionChainData();
    // }
  }

  getBankNiftyStock() {
    this.httpClient.get<any>(environment.BankNiftyStockUrl)
      .subscribe((data: any) => {
        this.bankniftydata = data.latestData[0];

        this.bankniftyDiffByLTPData.diffopen = parseFloat((parseFloat(this.bankniftydata.ltp.replace(',', '')) - parseFloat(this.bankniftydata.open.replace(',', ''))).toFixed(2));
        this.bankniftyDiffByLTPData.difflow = parseFloat((parseFloat(this.bankniftydata.ltp.replace(',', '')) - parseFloat(this.bankniftydata.low.replace(',', ''))).toFixed(2));
        this.bankniftyDiffByLTPData.diffhigh = parseFloat((parseFloat(this.bankniftydata.ltp.replace(',', '')) - parseFloat(this.bankniftydata.high.replace(',', ''))).toFixed(2));
        this.bankniftyDiffByLTPData.diffyHigh = parseFloat((parseFloat(this.bankniftydata.ltp.replace(',', '')) - parseFloat(this.bankniftydata.yHigh.replace(',', ''))).toFixed(2));
        this.bankniftyDiffByLTPData.diffyLow = parseFloat((parseFloat(this.bankniftydata.ltp.replace(',', '')) - parseFloat(this.bankniftydata.yLow.replace(',', ''))).toFixed(2));

      });
  }

  getOptionChainData() {
    this.httpClient.get<any>(environment.OptionChainUrl + 'BANKNIFTY')
      .subscribe((data: any) => {
        this.optionchaindata = data;

        //For BTST Strategy
        this.btst_strategy(this._todayDateInFormat, 'BANKNIFTY');
      });
  }

  btst_strategy(currentdate: string, typeofdata: string) {
    // Check The Date is Valid or Not

    if (this.optionchaindata.records.expiryDates[0] == currentdate) {
      currentdate = this.optionchaindata.records.expiryDates[1];
      this._btstdata = this.optionchaindata.records.data.filter((x: any) => x.expiryDate == currentdate);
    }
    else {
      this._btstdata = this.optionchaindata.filtered.data;
    }

    this.bankniftyValue = this.optionchaindata.records.underlyingValue;

    //For Put
    this._btstdata.filter((data: any) => data.strikePrice < this.bankniftyValue).sort((x: any) => x.PE.strikePrice).reverse()
      .slice(0, 8)
      .forEach((item: any) => {

        this.btstbnPutValue = {
          IV_total: parseFloat((this.btstbnPutValue.IV_total + item.PE.impliedVolatility).toFixed(2)),
          Volume_total: parseInt((this.btstbnPutValue.Volume_total + item.PE.totalTradedVolume).toString()),
          OI_total: parseInt((this.btstbnPutValue.OI_total + item.PE.openInterest).toString()),
          ChngOI_total: parseInt((this.btstbnPutValue.ChngOI_total + item.PE.changeinOpenInterest).toString())
        }

        this.optionchain_top16_data.push({
          CE_OI: parseInt(item.CE.openInterest),
          CE_changeOI: parseInt(item.CE.changeinOpenInterest),
          PE_OI: parseInt(item.PE.openInterest),
          PE_changeOI: parseInt(item.PE.changeinOpenInterest),
          SP: parseInt(item.PE.strikePrice),
          CE_totalBuyQuantity: parseInt(item.CE.totalBuyQuantity),
          CE_totalSellQuantity: parseInt(item.CE.totalSellQuantity),
          CE_totalTradedVolume: parseInt(item.CE.totalTradedVolume),
          PE_totalBuyQuantity: parseInt(item.PE.totalBuyQuantity),
          PE_totalSellQuantity: parseInt(item.PE.totalSellQuantity),
          PE_totalTradedVolume: parseInt(item.PE.totalTradedVolume)
        });

      });

    //For Call
    this._btstdata.filter((data: any) => data.strikePrice > this.bankniftyValue).sort((x: any) => x.CE.strikePrice)
      .slice(0, 8)
      .forEach((item: any) => {
        this.btstbnCallValue = {
          IV_total: parseFloat((this.btstbnCallValue.IV_total + item.CE.impliedVolatility).toFixed(2)),
          Volume_total: parseInt((this.btstbnCallValue.Volume_total + item.CE.totalTradedVolume).toString()),
          OI_total: parseInt((this.btstbnCallValue.OI_total + item.CE.openInterest).toString()),
          ChngOI_total: parseInt((this.btstbnCallValue.ChngOI_total + item.CE.changeinOpenInterest).toString())
        }

        this.optionchain_top16_data.push({
          CE_OI: parseInt(item.CE.openInterest),
          CE_changeOI: parseInt(item.CE.changeinOpenInterest),
          PE_OI: parseInt(item.PE.openInterest),
          PE_changeOI: parseInt(item.PE.changeinOpenInterest),
          SP: parseInt(item.CE.strikePrice),
          CE_totalBuyQuantity: parseInt(item.CE.totalBuyQuantity),
          CE_totalSellQuantity: parseInt(item.CE.totalSellQuantity),
          CE_totalTradedVolume: parseInt(item.CE.totalTradedVolume),
          PE_totalBuyQuantity: parseInt(item.PE.totalBuyQuantity),
          PE_totalSellQuantity: parseInt(item.PE.totalSellQuantity),
          PE_totalTradedVolume: parseInt(item.PE.totalTradedVolume)
        });

      });

    //Difference between Put & Call
    
      this.btstbnDiff.IV_total = parseFloat((this.btstbnCallValue.IV_total - this.btstbnPutValue.IV_total).toFixed(2));
      this.btstbnDiff.Volume_total = parseInt((this.btstbnCallValue.Volume_total - this.btstbnPutValue.Volume_total).toString());
      this.btstbnDiff.OI_total = parseInt((this.btstbnCallValue.OI_total - this.btstbnPutValue.OI_total).toString());

    //Output as Call Or Put for Buy
    //For Bank Nifty
    if (this.btstbnCallValue.IV_total > this.btstbnPutValue.IV_total) {
      if (this.btstbnCallValue.Volume_total > this.btstbnPutValue.Volume_total || this.btstbnCallValue.OI_total < this.btstbnPutValue.OI_total) {
        this.bankniftyBuy = 'CALL';
      }
      else {
        this.bankniftyBuy = 'PUT';
      }
    }
    else {
      this.bankniftyBuy = 'PUT';
    }

    this.optionchain_top16_data = this.optionchain_top16_data.sort((x: any, y: any) => { return x.SP - y.SP });

    this.optionchain_top16_data_total = {};

    this.optionchain_top16_data.forEach((item: any) => {
      this.optionchain_top16_data_total = {
        CE_OI: parseInt(item.CE_OI + (this.optionchain_top16_data_total.CE_OI ?? 0)),
        CE_changeOI: parseInt(item.CE_changeOI + (this.optionchain_top16_data_total.CE_changeOI ?? 0)),
        PE_OI: parseInt(item.PE_OI + (this.optionchain_top16_data_total.PE_OI ?? 0)),
        PE_changeOI: parseInt(item.PE_changeOI + (this.optionchain_top16_data_total.PE_changeOI ?? 0)),
        CE_totalBuyQuantity: parseInt(item.CE_totalBuyQuantity + (this.optionchain_top16_data_total.CE_totalBuyQuantity ?? 0)),
        CE_totalSellQuantity: parseInt(item.CE_totalSellQuantity + (this.optionchain_top16_data_total.CE_totalSellQuantity ?? 0)),
        CE_totalTradedVolume: parseInt(item.CE_totalTradedVolume + (this.optionchain_top16_data_total.CE_totalTradedVolume ?? 0)),
        PE_totalBuyQuantity: parseInt(item.PE_totalBuyQuantity + (this.optionchain_top16_data_total.PE_totalBuyQuantity ?? 0)),
        PE_totalSellQuantity: parseInt(item.PE_totalSellQuantity + (this.optionchain_top16_data_total.PE_totalSellQuantity ?? 0)),
        PE_totalTradedVolume: parseInt(item.PE_totalTradedVolume + (this.optionchain_top16_data_total.PE_totalTradedVolume ?? 0))
      };
    })


  }
}
