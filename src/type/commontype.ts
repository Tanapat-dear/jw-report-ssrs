import { Dayjs } from 'dayjs';
export interface MasterMccodeType{
    id: number;
    process_group: string;
    master_group:string;
    mc_code:string;
    actv_table:string;
    status_table:string;
    set_table:string | null;
}

export interface AutocompleteOption {
  label: string;
  value:string
}

export type DataSelectedType = {
  factory: string;       // ใช้ string ว่างเป็น initial
  process: string;
  machine_code: string;
  startdate: Dayjs | null;
  enddate: Dayjs | null;
  table: string;
};

export interface ErrorDialogtype{
  message?: string;
}


export interface TableComponentTypeProp{
  data: Array<any>;
  mccode: string | null;
  startdate: string | null;
  enddate: string | null

}

export interface TableRowTypeProp{
  row: any;
  headers:any;
}