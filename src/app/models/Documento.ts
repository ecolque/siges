export interface Documento {
    id?: number;
    registro_id?: number;
    tipo_documento_id?: number;
    nombre: string;
    sigla:string;
    extension: string;
    img:FormData; 
    nombre_tipo: string;   
}