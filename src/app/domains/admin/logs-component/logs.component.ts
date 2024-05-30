import { Component } from '@angular/core';
import { NgFor, } from '@angular/common';
import { DataService,LogRecord } from '../../../services/admin/data.service';


@Component({
  selector: 'app-logs-component',
  standalone: true,
  imports: [NgFor],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {

  startDate: string  = "2024-01-01"
  endDate: string  = "2025-01-01"
  q: string = "a"
  logs: LogRecord[]

  constructor (private dataService : DataService){

  }


  filterData(){
    const startDate = document.getElementById('startDate') as HTMLInputElement;
    const endDate = document.getElementById('endDate') as HTMLInputElement;
    const search = document.getElementById('search') as HTMLInputElement;


    console.log(search,startDate,endDate)

    this.dataService.getRecordsLogs(search.value,startDate.value,endtDate.value).subscribe(
      (data)=> {
        this.logs = data
      }
    )


  }


  ngOnInit(): void {
    this.dataService.getRecordsLogs(this.q,this.startDate, this.endDate).subscribe(
      (data)=> {
        this.logs = data
      }
    )
  }
}
