export class ProcessTransferHeader{
  condition: string
  message: string
  process_transfer_no: string
  status : string
  season : string
  from_stage : string
  to_stage :string
  crop_code	: string
  location : string
  item_no	: string
  item_name : string
  item_class_of_seeds:string
  item_crop:string
  created_by:string
  created_on:string
  ptl : Array<ProcessTransferLine> = []
}

export class ProcessTransferLine {
  line_no: number
  lot_no: string
  from_bincode: string;
  total_available_bags: number;
  total_available_qty: number;
  required_bags: number;
  required_qty: number;
  process_loss_qty: number;
  marketing_lot_no: string;
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
