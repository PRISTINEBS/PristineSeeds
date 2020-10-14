export class CustomerList {
    customer_id: string;
    full_name: string;
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
    stage:string;
}

export class deliveryOrderItemList {
  condition: string;
  message: string;
  crop_code : string;
  variety_group : string;
  marketing_indent_no : string;
  item_no : string;
  lot_no:string;
  item_class_of_seed :string;
  item_name : string;
  sales_type : string;
  FG_pack_size:number;
  no_of_bags:number;
  quantity:number;
  unit_price:number;
  total_amount:number;
}
 export class marketingindentno {
   document_no:string;
   location_id:string;
   customer_no:string;
   season:string;
 }

export class itemlotno {
  lot_no:string;
  remaining_quantity:number;

}
 export class itemdetaillist{
  item_no:string
  name:string;
  description:string;
  class_of_seed:string;
  fg_pack_size:number;
  item_group:string;
  unit_price:number;
  stage:string;
  cost_per_unit:number;
  mrp:number;

 }
