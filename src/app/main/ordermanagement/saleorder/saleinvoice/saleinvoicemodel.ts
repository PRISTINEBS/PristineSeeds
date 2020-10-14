export class Saleinvoicemodel {
    sales: Array<headers>
    bilTo: Address
    shioTo: Address
}

export class Address {
    address_type: string;
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
}

export class headers {
    position: number;
    amount: number;
    awb_no: string;
    barcode_no: string;
    box_code: string;
    condition: string;
    discount_amount: number;
    dsp_code: string;
    grand_total: number;
    gst_amount: number;
    header_grand_total: number;
    invoice_datetime: string;
    item_desc: string;
    item_no: string;
    mark_cancel: string;
    order_status: string;
    payment_type: string;
    qty: number;
    total_amount: number;
    weight: number;
    cust_no: string;
    sales_order_no: string;
    sales_order_line_no: number;

}