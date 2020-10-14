export class GateEntryList {
  condition: string;
  message: string;
  gate_entry_no: string;
  vendor_no: string;
  vender_no_or_company: string;
}

export class VendorList {
    condition: string;
    message: string;
    vendor_no: string;
    vendor_name: string;
}

export class PurchaseOrderInfo {
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
    purchase_order_no: string;
}

export class ItemList {
    condition: string;
    message: string;
    item_no: string;
    name: string;
    item_group: string;
    baseuom: string;
    class_of_seed: string;
    item_crop: string;
}

export class PurchaseOrderItemList {
    condition: string;
    message: string;
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
    is_vendor_lotno: number
}
