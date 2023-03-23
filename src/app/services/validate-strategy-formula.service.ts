import { Injectable } from '@angular/core';
import { Holidays } from '../modals/holidays';

@Injectable({
  providedIn: 'root'
})
export class ValidateStrategyFormulaService {
  
  private _dateforvalidation : string = '';
  constructor(private holidaysDates: Holidays) { }

  // // If Next Week Tarding Day will Holiday then Return 'True'
  // checknexttradendingdateisholiday(){
  //    this._dateforvalidation = this.createvaliddateformula(new Date(new Date().setDate(new Date().getDate() + 7)));
  //   if(this.holidaysDates.holidaysDate.filter((dates :any) => dates.date == this._dateforvalidation).length > 0){
  //     this._dateforvalidation = this.createvaliddateformula(new Date(new Date().setDate(new Date().getDate() + 6)));
  //     if(this.holidaysDates.holidaysDate.filter((dates :any) => dates.date == this._dateforvalidation).length > 0){
  //       this._dateforvalidation = this.createvaliddateformula(new Date(new Date().setDate(new Date().getDate() + 5)));
  //       if(this.holidaysDates.holidaysDate.filter((dates :any) => dates.date == this._dateforvalidation).length > 0){
  //         this._dateforvalidation = this.createvaliddateformula(new Date(new Date().setDate(new Date().getDate() + 4)));
  //         if(this.holidaysDates.holidaysDate.filter((dates :any) => dates.date == this._dateforvalidation).length > 0){
  //           this._dateforvalidation = this.createvaliddateformula(new Date(new Date().setDate(new Date().getDate() + 3)));
  //         }
  //       }
  //     }
  //   }
  //   return this._dateforvalidation;
  // }

  createvaliddateformula(_date: Date){
    const _dt = _date.getDate().toString().length == 2 ? _date.getDate().toString() : '0' + _date.getDate().toString();
    const _month = _date.toDateString().substr(4,3);
    const _year = _date.getFullYear();
    return _dt + '-' + _month + '-' + _year;
  }
}
