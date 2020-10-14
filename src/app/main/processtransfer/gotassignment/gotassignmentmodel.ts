export class gotassignmentmodel{
  id : number;
  got_test_no : string;
  crop_code : string;
  item_no : string;
  item_name : string;
  lot_no : string;
  sample_code : string;
  stage_code : string;
  arrival_qty : number;
  location_code : number;
  created_by : string
  created_on : string;
  assignment_done : number;
  assignment_by : string;
  assignment_on : string;
  total_no_of_plants : number;
  total_self_plants : number;
  total_off_type_plants : number;
  total_no_of_genetically_plants : number;
  genetic_pure_plants_per : number;
  self_plants_per : number;
  off_type_plants_per : number;
  result : string;
  date_of_result_declared : string;
  got_off_type_plant_code : string;
  got_off_type_plant_description : string;
  got_test_done : number;
  got_test_done_by : string;
  got_test_done_on : string;
  sub_cat_name : string;
  crop_type : string;
  class_of_seed : string;
}

export class got_assignment_update {
  id : number;
  assignment_done : number;
}

export class got_field_test_update{
  id : number;
  total_no_of_plants : number;
  total_self_plants : number;
  total_off_type_plants : number;
  total_no_of_genetically_plants : number;
  genetic_pure_plants_per : number;
  self_plants_per : number;
  off_type_plants_per : number;
  result : string;
  date_of_result_declared : string;
  got_off_type_plant_code : string;
  got_off_type_plant_description : string;
  got_test_done : number;
}
