import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { faFileWord, faFileExcel,faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-stats-super-admin',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './stats-super-admin.component.html',
  styleUrl: './stats-super-admin.component.css'
})
export class StatsSuperAdminComponent {

  public startDate: string;
  public endDate: string;

  faFilePdf = faFilePdf
  faFileExcel = faFileExcel

  constructor (private http: HttpClient){}

  viewPDF(){

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
}
