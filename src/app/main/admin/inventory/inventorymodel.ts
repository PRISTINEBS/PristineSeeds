export class item_barcode_bin_info {
  barcode: string;
  bincode: string;
  condition: string;
  expiry_date: string;
  item_no: string;
  location_id: number
  location_name: string;
  lot_no: string;
  quantity: number;
  reserved_quantity: number;
  season: string;
  stage: string;
}

export class item_bin_inventory {
  bin_type: string;
  bincode: string;
  condition: string;
  expiry_date: string;
  item_no: string;
  location_id: number;
  location_name: string;
  lot_no: string;
  pick_reservation: number;
  quantity: number;
  quantity_to_take: number;
  season: string;
  stage: string;
}

export class item_inventory_by_location {
  condition : string;
  item_no : string;
  location_id : number;
  location_name : string;
  good_inventory : number;
  bad_inventory : number;
  stage : string;
  season : string;
  quantity_to_take : number;
  reservation_quantity : number;
}


