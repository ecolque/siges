import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
//import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UtilsService } from './utils.service';
import { RegisterService } from './register.service';

import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class DocumentoService {
  documento: any;
  servicioBasico: any;
  observation: any;
  registerId: number = 0;
  tipoServicios: any = [];
  documentos: any = [];
  //families: any[]= [];
  tipoDocumentoVenta: any[] = [];
  public static archivo: any;
  //public static documento: any= [];
  static caracteristica: any;
  selectedFile: File = null;
  public file: any;

  listadocumentos: any[] = [];

  constructor(
    private http: Http
  ) { }

/*
  uploadDocumento(file, id) {
    console.log('uploadDocumento ');
    let uploadURL = UtilsService.documentoBaseUrl + `uploadDocumento`;
    //const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
    const headers = new Headers({ 'Content-Type': undefined });
    let options = new RequestOptions({ headers: headers });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('id', id);
    //console.log(options);
    return this.http.post(uploadURL, fd, options)
      .map(UtilsService.extractData)
      .do(data => console.log(data))
      .catch(UtilsService.handleError);    
  }
*/
  public uploadArchivo(data: FormData) {    
    //console.log(data);        
    let uploadURL = UtilsService.documentoBaseUrl + `uploadDocumento`;        
    return this.http.post(uploadURL, data).subscribe((res: any) => {
      //this.file = res.data;            
      console.log("archivo subido");
    }, (err: any) => {
      console.log("error al subir el archivo");
      // Show error message or make something.
    });    
  }

  public listaTipoDocumentoVentas(): Observable<any[]> {
    this.tipoDocumentoVenta = [];
    let uploadURL = UtilsService.documentoBaseUrl + `getTipoDocumentoVenta`;
    return this.http.get(uploadURL)
      .map(UtilsService.extractData)
      .do(data => { this.tipoDocumentoVenta = data } )
      .catch(UtilsService.handleError);
  }
     
  listaDocumentoVentas(registerId: number):Observable<any[]> {
    this.listadocumentos = [];
    let params = UtilsService.documentoBaseUrl + `getListaDocumentoVenta/` + registerId;
    return this.http.get(params)
            .map(UtilsService.extractData)
            .do(data => { this.listadocumentos = data })
            .catch(UtilsService.handleError);            
  }
    
  eliminarArchivo(registerId: number, Id: number, nombre:string):Observable<any[]> {    
    //http://10.10.0.102:8080/siges/documentoService/eliminarFile/{{obj.registro_id}}/{{obj.nombre}}
    let params = UtilsService.documentoBaseUrl + `eliminarFile/` + registerId +`/` + Id +`/` + nombre;
    return this.http.get(params)
            .map(UtilsService.extractData)
            .do(data => { console.log("ok");})
            .catch(UtilsService.handleError);            
  }
     
}
