export class qcfinaltest{
  id : number;
  crop_code : string;
  item_no : string;
  item_name : string;
  lot_no : string;
  sample_code : string;
  arrival_qty : number;
  location_code : number;
  created_by : string
  created_on : string;
  got_test_result	: string;
  bt_elisa_result	: string;
  germination_result		: string;
  pp_result		: string;
  moisture_result		: string;
  vigour_result		: string;
  final_result		: string;
  final_result_date		: string;
  final_result_done		: number;
  final_result_done_by	: string;
  sub_cat_name : string;
  crop_type : string;
  class_of_seed : string;
}

export class qcfinal_update{
  id : number;
  final_result : string;
  final_result_date : string;
  final_result_done : number;
}
