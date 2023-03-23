import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { ValidateStrategyFormulaService } from '../services/validate-strategy-formula.service';
import { BTSTCallValue, BTSTPutValue, BTSTDiff } from '../modals/btstmodal';
import { NiftyData, NiftyDiffByLTPData } from '../modals/niftydatamodal';
import { environment } from '../../environments/environment.development';


@Component({
  selector: 'app-nifty-data',
  templateUrl: './nifty-data.component.html',
  styleUrls: ['./nifty-data.component.scss']
})
export class NiftyDataComponent {
  public btstCallValue = new BTSTCallValue();
  public btstPutValue = new BTSTPutValue();
  public btstDiff = new BTSTDiff();

  public niftydata = new NiftyData();
  public niftyDiffByLTPData = new NiftyDiffByLTPData();

  public niftyValue: any;
  public niftyBuy: string = '';

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
    this.getNiftyData();
    this.getOptionData();
  }

  onSelectedTimeZone(value: string) {
    this.selectedTimeZone = parseInt(value) * 60000;
  }

  startandendOpeartionofAnalysis() {
    //For Nifty Today's Data
    setInterval(() => {
      this.getNiftyData();
    }, this.selectedTimeZone / 5);

    //For BTST Strategy
    setInterval(() => {
      this.getOptionData();
    }, this.selectedTimeZone);
  }

  getNiftyData() {
    // if ((new Date()).getHours() >= 9 && (new Date()).getHours() <= 15) {
    this.getNiftyStock();
    // }
  }

  getOptionData() {
    // if ((new Date()).getHours() >= 9 && (new Date()).getHours() <= 15) {
    this.btstLastTriggerTime = new Date().toLocaleTimeString();

    this.btstCallValue = new BTSTCallValue();
    this.btstPutValue = new BTSTPutValue();

    this.optionchain_top16_data = [];

    this.getOptionChainData();
    // }
  }

  getNiftyStock() {
    this.httpClient.get<any>(environment.NiftyStockUrl)
      .subscribe((data: any) => {
        this.niftydata = data.latestData[0];

        this.niftyDiffByLTPData.diffopen = parseFloat((parseFloat(this.niftydata.ltp.replace(',', '')) - parseFloat(this.niftydata.open.replace(',', ''))).toFixed(2));
        this.niftyDiffByLTPData.difflow = parseFloat((parseFloat(this.niftydata.ltp.replace(',', '')) - parseFloat(this.niftydata.low.replace(',', ''))).toFixed(2));
        this.niftyDiffByLTPData.diffhigh = parseFloat((parseFloat(this.niftydata.ltp.replace(',', '')) - parseFloat(this.niftydata.high.replace(',', ''))).toFixed(2));
        this.niftyDiffByLTPData.diffyHigh = parseFloat((parseFloat(this.niftydata.ltp.replace(',', '')) - parseFloat(this.niftydata.yHigh.replace(',', ''))).toFixed(2));
        this.niftyDiffByLTPData.diffyLow = parseFloat((parseFloat(this.niftydata.ltp.replace(',', '')) - parseFloat(this.niftydata.yLow.replace(',', ''))).toFixed(2));

      });
  }

  getOptionChainData() {
    this.httpClient.get<any>(environment.OptionChainUrl + 'NIFTY')
      .subscribe((data: any) => {
        this.optionchaindata = data;

        //For BTST Strategy
        this.btst_strategy(this._todayDateInFormat, 'NIFTY');
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

    this.niftyValue = this.optionchaindata.records.underlyingValue;

    //For Put
    this._btstdata.filter((data: any) => data.strikePrice < this.niftyValue).sort((x: any) => x.PE.strikePrice).reverse()
      .slice(0, 8)
      .forEach((item: any) => {
        this.btstPutValue = {
          IV_total: parseFloat((this.btstPutValue.IV_total + item.PE.impliedVolatility).toFixed(2)),
          Volume_total: parseInt((this.btstPutValue.Volume_total + item.PE.totalTradedVolume).toString()),
          OI_total: parseInt((this.btstPutValue.OI_total + item.PE.openInterest).toString()),
          ChngOI_total: parseInt((this.btstPutValue.ChngOI_total + item.PE.changeinOpenInterest).toString())
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
    this._btstdata.filter((data: any) => data.strikePrice > this.niftyValue).sort((x: any) => x.CE.strikePrice)
      .slice(0, 8)
      .forEach((item: any) => {
        this.btstCallValue = {
          IV_total: parseFloat((this.btstCallValue.IV_total + item.CE.impliedVolatility).toFixed(2)),
          Volume_total: parseInt((this.btstCallValue.Volume_total + item.CE.totalTradedVolume).toString()),
          OI_total: parseInt((this.btstCallValue.OI_total + item.CE.openInterest).toString()),
          ChngOI_total: parseInt((this.btstCallValue.ChngOI_total + item.CE.changeinOpenInterest).toString())
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
    this.btstDiff.IV_total = parseFloat((this.btstCallValue.IV_total - this.btstPutValue.IV_total).toFixed(2));
    this.btstDiff.Volume_total = parseInt((this.btstCallValue.Volume_total - this.btstPutValue.Volume_total).toString());
    this.btstDiff.OI_total = parseInt((this.btstCallValue.OI_total - this.btstPutValue.OI_total).toString());

    //Output as Call Or Put for Buy
    //For Nifty
    if (this.btstCallValue.IV_total > this.btstPutValue.IV_total) {
      if (this.btstCallValue.Volume_total > this.btstPutValue.Volume_total || this.btstCallValue.OI_total < this.btstPutValue.OI_total) {
        this.niftyBuy = 'CALL';
      }
      else {
        this.niftyBuy = 'PUT';
      }
    }
    else {
      this.niftyBuy = 'PUT';
    }

    // For PCR Data
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
