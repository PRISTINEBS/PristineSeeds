export class DeliveryOrderList {
   id: string;
    document_no: string;
}
export class childseedtype{
  class_of_seed:string
}
export class childitem{
  item_no:string
  item_det:string
}
export class LocationList {
  condition: string;
  message: string;
  location_id: number;
  location_name: string;
  location_type:string;
}
export class customerInfo{
  address: string
  city: string
  condition: string
  country: string
  created_by: string
  created_on: string
  customer_name:string
  customer_no: string
  district: string
  document_no: string
  email_id: string
  mobile_no: string
  pincode: string
  region: string
  state:string
  status: string
  taluka: string
  village: string
  zone: string
}

export class LineInfo{
  condition:string
  validation:boolean
  crop_code:string
  stage:string
  fg_pack_size: number
  item_class_of_seed:string
  item_no:string
  lot_no:string
  item_name:string
  no_of_bags:number
  quantity: number
  ship_no_of_bags:number
  ship_quantity: number
  receipt_no_of_bags:number
  receipt_quantity: number
  total_amount: number
  unit_price: number
  variety_group: string
}
export class FullCustomerInfo {
    customer_id: string;
    full_name: string;
    email_no: string;
    mobile_number: string;
    pan_no: string;
    gst_no: string;
    id: string;
    name: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    village: string;
    taluka: string;
    district:string;
    email_id: string;
    zone:string;
    mobile_no: string;
  region:string;
    billtoselected: boolean = false;
    shiptoselected: boolean = false;
}
export class transferorderheader{
  condition: string
  created_by: string
  created_on: string
  document_no:string
  is_in_transit: string
  is_receipted: string
  is_shiped: string
  posting_date: string
  season_code:string
  status: string
  transfer_from: string
  transfer_to:string
  transit_code:string
}
export class transferorderlineinfo{
  class_of_seed: string
  condition: string
  crop_code: string
  document_line_no: number
  document_no: string
  fg_pack_size: number
  item_group: string
  item_no: string
  line_amount: number
  lot_no: string
  no_of_bags: number
  quantity: number
  receipt_no_of_bags: number
  receipt_no_of_quantity: number
  ship_no_of_bags: number
  ship_no_of_quantity: number
  stage: string
  unit_price: number
}
export class bsioitemmodel{
  condition:string
  item_no:string
  item_name:string
  validation:boolean=false
}

export class itemdetails{
  class_of_seed:string
  condition:string
  cost_per_unit: number
  description: string
  fg_pack_size:number
  item_group: string
  item_no: string
  mrp: number
  name: string
  stage: string
  unit_price:number

}

