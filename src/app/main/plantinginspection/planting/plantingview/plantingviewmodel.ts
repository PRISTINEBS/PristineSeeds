export class Plantingviewmodel {
  planting_no: string;
  planting_line_id : number;
  line_id : number;
  organiser_code: string;
  organiser_name: string;
  season: string;
  status_name: string;
  created_by: string;
  created_on: string;
  location_id : number;
  fsio_no : string;
  stage : string;
  category : string;
  sowing_area_in_r : number;
  land_in_r : number;
  total_sowing_area_in_r:number;
  production_lot_no:string;
  check_production:number = 0;
}

export class get_fsio_grower_details {

  condition:string;
  planting_no:string;
  planting_line_id:number;
  line_id:number;
  fsio_no:string;
  grower_no:string
  grower_name:string
  item_no:string;
  item_name:string;
  item_class_of_seed:string;
  item_crop_type:string;
  category:string;
  item_uom:string
  sowing_date:string;
  sowing_area_in_r:number;
  total_sowing_area_in_r:number;
  production_lot_no:string;
  revised_yield:number;
  inspection_1:number;
  inspection_2:number;
  inspection_3:number;
  inspection_4:number;
  inspection_qc:number;
  check_production:number = 0;

}

export class get_fsio_no {
  document_no: string;
  category: string;
  land_in_r:number;
}

export class fsio_no_model {
  fsio_no : string;
}

export class production_generate {
  planting_line_id : number;
  line_id : number;
}

