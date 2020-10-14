export class DeliveryOrderList {
   id: string;
    document_no: string;
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

export class doInfo{
  LR_RR_date:string
  LR_RR_no: string
  advanced_paid:number
  condition: string
  document_no: string
  order_status:string
  order_datetime:string
  freight:string
  freight_to_pay:number
  freight_total:number
  promised_delivery_date:string
  request_delivery_date:string
  salesperson_code:string
  transporter_code:string
  transpoter_name:string
  vehicle_no: string
}
export class doLineInfo{
  condition:string
  crop_code:string
  document_no:string
  fg_pack_size: number
  item_no:string
  lot_no:string
  item_name:string
  line_no:number
  marketing_indent_no:string
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

export class ItemWithAmountList {
    name: string;
    item_no: string;
}

export class deliveryOrderItemList {
  condition: string;
  message: string;
  crop_code : string;
  variety_group : string;
  marketing_indent_no : string;
  item_no : string;
  item_class_of_seed :string;
  item_name : string;
  sales_type : string;
  FG_pack_size:number;
  no_of_bags:number
  quantity:number
  unit_price:number
  total_amount:number
}
 export class marketingindentno {
   document_no:string;
   location_id:string;
   customer_no:string;
 }

 export class itemdetaillist{
  item_no:string
   name:string;
  description:string;
  class_of_seed:string;
  fg_pack_size:number;
  item_group:string;
  unit_price:number;
  cost_per_unit:number;
  mrp:number;
 }
