
export class Gateentryinfoandupdatemodel {

  condition : string;
  gate_entry_no : string;
  gate_entry_datetime : string;
  vender_no_or_company : string;
  vendor_no : string;
  document_type : string;
  document_no : string;
  location_id : number;
  vehicle_no : string;
  drive_name : string;
  driver_number : string;
  transporter : string;
  lr_no : string;
  lr_date : string;
  ch_no : string;
  ch_date : string;
  created_by : string;
  freight : string;
  freight_amount : number;
  no_of_boxes : string;
  gate_entry_status : string;
  item_description : string;
  gec : Array<gateentrychallan> = [];
}

export class gateentrychallan {
  line_id:number;
  challan_no:string;
  challan_date:string;
  crop:string;
  description:string;
  baseuom:string;
  no_of_bags:number;
  quantity:number;
}


