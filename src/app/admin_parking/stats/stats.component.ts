import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '@shared/components/header/header.component';
import { City,Parking, DataService } from '../../services/admin/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports : [HeaderComponent, NgFor],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  public chart: any;
  public PieChart: any;
  public LineChart: any;
  public startDate: string;
  public endDate: string;
  public parking_id :string;
  public city_id :string;
  public stats: any;
  public cities: City[];
  public parkings: Parking[];

  constructor (private http: HttpClient, private dataservice: DataService){}

  fetchData() {

    const fecha_inicio = document.getElementById('fecha_inicio') as HTMLInputElement;
    const fecha_final = document.getElementById('fecha_final') as HTMLInputElement;
    const city = document.getElementById('id_city') as HTMLInputElement;
    const parking = document.getElementById('id_parking') as HTMLInputElement;

    this.startDate = fecha_inicio.value
    this.endDate = fecha_final.value
    this.city_id = city.value
    this.parking_id = parking.value

    const body = { 
            startDate: this.startDate,
            endDate: this.endDate,
            id_parkig_fk : this.parking_id,
            id_city_fk : this.city_id
      };

      
    this.http.post(environment.apiUrl + '/statistics-admin', body).subscribe((data: any) => {
      // Aquí puedes manejar la respuesta del endpoint
      this.stats = data
      this.createChart(data);
    });
  }

  createChart(data:any){
  
    //Bar Chart
    let days = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']

    let result = [];
    for (let day of days) {
          result.push(data.countEarningByDays[day]);
    }


    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: days, 
	       datasets: [
          {
            label: "Ganancias",
            data: result,
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });




    //PIE Chart
    this.PieChart = new Chart("PieChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ["Ingresos totales" , "Horas totales" , "Reservas Terminadas" , "Reservas canceladas"], 
	       datasets: [
          {
            label: "Estadisticas generales",
            data: [
              data.getGeneralStatics.totalRevenue,
              data.getGeneralStatics.totalHours,
              data.getGeneralStatics.finishedReservations,
              data.getGeneralStatics.canceledReservations
            ],
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });

    //Line Chart
    let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0]
    let value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let item of data.countReservationByHour) {
      value[item.hora-1] = item.reservas
    }


    this.LineChart = new Chart("LineChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: hours, 
	       datasets: [
          {
            label: "Reservas por horas",
            data: value,
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

  ngOnInit(): void {
    this.startDate = '2024-04-01'; // Fecha de hace un mes
    this.endDate = '2024-05-01'; // Fecha actual

    this.dataservice.getOptionsCities().subscribe(
      (options) =>{
        this.cities  = options
      }
    )


    this.dataservice.getParkings().subscribe(
      (options) => {
        this.parkings = options
      }
    )


  }
}
