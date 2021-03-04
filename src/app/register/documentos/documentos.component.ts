import { Text } from 'ol/style.js';
import { Documento } from './../../models/Documento';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterService } from './../../services/register.service';
import { DocumentoService } from './../../services/documento.service';
import { UtilsService } from './../../services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



import { Observable } from 'rxjs/Observable';
import { MsgModalComponent } from '../../shared/utils/msg-modal/msg-modal.component';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})

export class DocumentosComponent implements OnInit {

  public register: any;
  busy: Subscription;
  busy1: Subscription;
  busy2: Subscription;

  tipoDocumentoVentas: any[] = [];

  //listadocumentos: any= [];
  listadocumentos: any = [];
  marcaElegida: Documento = null;

  uploadedFiles: Array<File>;
  registerId: number = 0;
  nombre: string = "";
  id: number = 0;

  form: FormGroup;
  error: string;
  userId: number = 1;
  uploadResponse = { status: '', message: '', filePath: '' };

  archivoElegido: File = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    public activeModal: NgbActiveModal,
    private documentoService: DocumentoService
  ) { }

  ngOnInit() {
    console.log(this.register.id);
    this.registerId = this.register.id;

    this.busy = this.documentoService.listaTipoDocumentoVentas().subscribe(data => {
      this.tipoDocumentoVentas = this.documentoService.tipoDocumentoVenta;
      console.log(this.tipoDocumentoVentas);
    }, error => { });


    /*this.busy1 = this.documentoService.listaDocumentoVentas(this.registerId).subscribe(data => {
      this.listadocumentos = this.documentoService.listadocumentos;
      console.log(this.listadocumentos);
    }, error => { });*/

    this.onListarDocumentos();

  }

  onListarDocumentos() {
    this.busy1 = this.documentoService.listaDocumentoVentas(this.registerId).subscribe(data => {
      this.listadocumentos = this.documentoService.listadocumentos;
      console.log(this.listadocumentos);
    }, error => { });

  }



  onArchivoElegido($event) {
    console.log($event);
    this.archivoElegido = <File>$event.target.files[0];
  }

  onSubirArchivo() {
    //let tipoDocumento = this.form.get("tipoDocumento").value;
    //console.log(this.marcaElegida);
    if (this.marcaElegida != null) {
      //console.log("archivo elegido=" + this.marcaElegida);
      if (this.archivoElegido != null) {
        const fd = new FormData();
        fd.append('file', this.archivoElegido);
        fd.append('registro_id', this.registerId.toString());
        fd.append('tipo_documento_id', this.marcaElegida.tipo_documento_id.toString());
        fd.append('user_id', this.userId.toString());
        this.documentoService.uploadArchivo(fd);
        this.onListarDocumentos();        
        this.archivoElegido;
      }
    }
  }

  onEliminarArchivo(registroId, id, nombre) {
    this.busy2 = this.documentoService.eliminarArchivo(registroId, id, nombre).subscribe(data => {
      console.log("elimino archivo");
      this.onListarDocumentos();
    }, error => { });

  }


}
