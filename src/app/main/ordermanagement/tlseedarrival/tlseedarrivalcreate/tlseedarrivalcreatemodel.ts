export class Tlseedarrivalcreatemodel {

  condition: string;
  message: string;
  production_lot_no:string
  item_no: string;
  item_descrition: string;
  baseuom: string;
  stage: string;
  lot_no: string;
  no_of_bags: number;
  applied_no_of_bags: number;
  quantity: number;
  cost_per_unit: number;
  gst_percentage: number;
  amount: number;
  discount: number;
  total_amount: number;
  gst_amount: number;
  grand_total: number;
  is_expire_date: number;
  is_vendor_lotno: number;

}

export class TLSeedArrivalInfo {
  condition: string;
  message: string;
  gate_entry_no: string;
  vendor_no: string;
  vendor_name: string;
  vendor_address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  mobile_no: string;
  tl_seed_arrival_no: string;
}

export class GetItemDetailsOnProductionLotNoScan {
  condition:string;
  season:string;
  stage:string;
  category_id:number;
  sub_category_id:number;
  category:string;
  sub_category:string;
  item_no:string;
  item_name:string;
  item_class_of_seed:string;
  item_crop_type:string;
  item_uom:string;
}
