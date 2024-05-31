import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { faFileWord, faFileExcel,faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { City, Parking, DataService } from '../../../services/admin/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-stats-super-admin',
  standalone: true,
  imports: [FontAwesomeModule, NgFor],
  templateUrl: './stats-super-admin.component.html',
  styleUrl: './stats-super-admin.component.css'
})
export class StatsSuperAdminComponent implements OnInit {

  public startDate: string;
  public endDate: string;

  faFilePdf = faFilePdf
  faFileExcel = faFileExcel
  public parking_id :string;
  public city_id :string;
  public cities: City[];
  public parkings: Parking[];

  constructor (private http: HttpClient, private dataservice: DataService){}

  viewPDF(){

    const fecha_inicio = document.getElementById('fecha_inicio') as HTMLInputElement;
    const fecha_final = document.getElementById('fecha_final') as HTMLInputElement;
    const city = document.getElementById('id_city') as HTMLInputElement;
    const parking = document.getElementById('id_parking') as HTMLInputElement;

    this.startDate = fecha_inicio.value
    this.endDate = fecha_final.value
    this.city_id = city.value
    this.parking_id = parking.value
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    const body = {
      headers: headers,
      responseType: 'blob',
      startDate: this.startDate,
      endDate: this.endDate,
      type: "inline",
      ...(this.parking_id && { id_parkig_fk: parseInt(this.parking_id) }),
      ...(this.city_id && { id_city_fk: parseInt(this.city_id) })
    };

      const options = { headers : headers, responseType: 'blob' as 'json'};

    let url = environment.apiUrl + '/statistics-pdf'

    this.http.post<Blob>(url,body,options).subscribe(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.getElementById('pdfFrame') as HTMLIFrameElement;
      iframe.src = blobUrl


    }, error => {
      console.error('Error downloading the file:', error);
    });
    }


  fetchData(){

    const fecha_inicio = document.getElementById('fecha_inicio') as HTMLInputElement;
    const fecha_final = document.getElementById('fecha_final') as HTMLInputElement;

    this.startDate = fecha_inicio.value
    this.endDate = fecha_final.value
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    const body = { 
      headers  : headers,
      responseType: 'blob', 
      startDate: this.startDate, 
      endDate: this.endDate, 
      type: "inline" };

      const options = { headers : headers, responseType: 'blob' as 'json'};

    let url = environment.apiUrl + '/statistics-pdf'

    this.http.post<Blob>(url,body,options).subscribe(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'archivo.pdf'; // Nombre predeterminado del archivo descargado
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Liberar el objeto URL
      
    
    }, error => {
      console.error('Error downloading the file:', error);
    });
    }

    fetchDataExcel(){

      const fecha_inicio = document.getElementById('fecha_inicio') as HTMLInputElement;
      const fecha_final = document.getElementById('fecha_final') as HTMLInputElement;
  
      this.startDate = fecha_inicio.value
      this.endDate = fecha_final.value
      let headers = new HttpHeaders();
      headers = headers.set('Accept', 'application/xlsx');
  
      const body = { 
        headers  : headers,
        responseType: 'blob', 
        startDate: this.startDate, 
        endDate: this.endDate, 
        type: "inline" };
  
        const options = { headers : headers, responseType: 'blob' as 'json'};
  
      let url = environment.apiUrl + '/statistics-excel'
  
      this.http.post<Blob>(url,body,options).subscribe(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'archivo.xlsx'; // Nombre predeterminado del archivo descargado
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl); // Liberar el objeto URL
        
      
      }, error => {
        console.error('Error downloading the file:', error);
      });
      }


    ngOnInit(): void {

    
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
