export class Tlseedarrivalviewmodel {
  condition: string;
  vendor_address: string;
  document_no: string;
  documentNo: string;
  documentLineNo: string;
  vendor_no: string;
  gate_entry_no: string;
  order_date: string;
  exp_date: string;
  expiry_date_receipt: string;
  pay_terms: string;
  document_status: string;
  document_status_desc: string;
  created_by: string;
  production_lot_no:string;
  item_no: string;
  stage: string;
  lot_no: string;
  no_of_bags: number;
  applied_no_of_bags: number;
  pending_no_of_bags: number;
  quantity: number;
  pending_grn_quantity: number;
  mrp: number;
  amount: number;
  discount: number;
  gst_percentage: number;
  gst_amount: number;
  net_amount: number;
  total_amount: number;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  total_ordered_qty: number;
  total_received_qty: number;
  total_accepted_qty: number;
  total_reject_qty: number;
}

export class TlseedarrivalGRN {
  gate_entry_no: string;
  grn_no: string;
  grn_status: string;
  grn_created_by: string;
  grn_created_datetime: string;
  document_type: string;
  external_document_no: string;
  external_document_date: string;
  accpeted_qty: string;
  rejected_qty: string;
  grn_completed_by: string;
  grn_completed_datetime: string;
  gib: Array<TlseedarrivalGRNItems>
}

export class TlseedarrivalGRNItems {
  item_no: string;
  accepted_qty: string;
  rejected_qty: string;
  putway_qty: string;
  vendor_lot_no: string;
  expire_date: string;
}
