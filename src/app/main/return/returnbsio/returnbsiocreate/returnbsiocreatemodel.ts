export class Returnbsiocreatemodel {

}

export class get_document_no_from_ile {
  condition : string;
  document_no : string;
  customer_no : string;
}

export class get_bsio_details_from_ile {
  condition: string;
  message: string;
  customer_no: string;
  ile_no:number;
  entry_type:string;
  document_type:string;
  order_no:string;
  document_no:string;
  sales_order_no:string;
  item_type:string;
  crop_type:string;
  class_of_seed:string;
  class_of_variety:string;
  variant_code:string;
  season:string;
  main_category:string;
  sub_category:string;
  item_no:string;
  item_name:string;
  fg_pack_size:number;
  item_group:string;
  production_lot_no:string;
  lot_no:string;
  no_of_bags:number;
  location_id:string;
  quantity:number;
  returned_no_of_bags : number;
  returned_quantity : number;
  return_no_of_bags:number;
  return_quantity:number;
  invoiced_quantity:number;
  remaining_quantity:number;
  loss_type:string;
  created_by:string;
  created_on:string;
}

export class createreturnbsio {

  ile_no:number;
  item_no:string;
  item_name:string;
  lot_no:string;
  no_of_bags:number;
  quantity:number;

}

