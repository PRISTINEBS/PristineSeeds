export class SeasonMastermodel {
  condition: string
  message: string
  season_code: string
  description: string
}

export class ItemLotNoFromILEmodel {
  condition: string
  message: string
  lot_no: string
  total_available_bags: number
  total_available_qty: number
}

export class BincodeLocation {
  condition: string
  message: string
  bincode: string
  bin_type: string
}

export class ProcessTransferLine {
  condition: string
  message: string
  process_transfer_no: string
  line_no: number
  lot_no: string
  from_bincode: string;
  total_available_bags: number;
  total_available_qty: number;
  required_bags: number;
  required_qty: number;
  process_loss_qty: number;
  marketing_lot_no: string;
  packing_item_code: string;
  date_of_testing: string;
  expiry_date: string;
  good_no_of_bags: number;
  good_qty: number;
  lint_no_of_bags: number;
  lint_qty: number;
  lint_bincode : string;
  remenant_no_of_bags : number;
  remenant_qty: number;
  remenant_bincode : string;
  to_location_code:number;
}

