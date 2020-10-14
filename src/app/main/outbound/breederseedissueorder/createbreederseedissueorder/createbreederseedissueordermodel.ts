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
  male_female:string
  item_no:string
  lot_no:string
  item_name:string
  no_of_bags:number
  quantity: number
  sales_type: string
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

export class bsioitemmodel{
  condition:string
  item_no:string
  item_name:string
  validation:boolean=false
}

