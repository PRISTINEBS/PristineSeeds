export class Bulkingcreatemodel {

  item_no: string;
  item_name: string;
  item_uom: string;
  bincode: string;
  expiry_date: string;
  marketing_lot_no:string;
  new_lot_no:string;
  total_available_qty: number;
  total_available_bags: number;

}

export class BulkingLine {
  marketing_lot_no: string;
  new_lot_no: string;
  no_of_bags: number;
  quantity: number;
  expiry_date: string;
}
