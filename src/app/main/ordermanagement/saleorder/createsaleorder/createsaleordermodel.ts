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
    email_id: string;
    mobile_no: string;
    zone: string;
    district: string;
    region: string;
    billtoselected: boolean = false;
    shiptoselected: boolean = false;
}

export class ItemWithAmountList {
    name: string;
    item_no: string;
}

export class SaleOrderItemList {
    condition: string;
    message: string;
    item_no: string;
    item_descrition: string;
    quantity: number;
    cost_per_unit: number;
    gst_percentage: number;
    amount: number;
    discount_percentage: number;
    discount: number;
    total_amount: number;
    gst_amount: number;
    grand_total: number;
}
