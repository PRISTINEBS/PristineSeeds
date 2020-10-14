export class Deliveryorderviewmodel {
    sales: Array<{
        condition: string;
        document_no: string;
        order_datetime: string;
        shipment_no: string;
        payment_type: string;
        ship_agent_code: string;
        docket_no: string;
        cust_no: string;
        order_status: string;
        canceled: string;
        item_no: string;
        ordered_quantity: string;
        amount: string;
        discount: string;
        total_amount: string;
        gst_amount: string;
        grand_total: string;
    }>
    bilTo: Address
    shioTo: Address
}
export class customerInfo{
  address: string
  city: string
  condition: string
  country: string
  created_by: string
  created_on: string
  customer_name:string
  customer_no: string
  district: string
  document_no: string
  email_id: string
  mobile_no: string
  pincode: string
  region: string
  state:string
  status: string
  taluka: string
  village: string
  zone: string
}
export class doInfo{
  LR_RR_date:string
  LR_RR_no: string
  advanced_paid:number
  order_status:string
  order_datetime:string
  condition: string
  document_no: string
  freight:string
  freight_to_pay:number
  freight_total:number
  promised_delivery_date:string
  request_delivery_date:string
  salesperson_code:string
  transporter_code:string
  transpoter_name:string
  vehicle_no: string
}
export class doLineInfo{
  condition:string
  crop_code:string
  document_no:string
  fg_pack_size: number
  item_no:string
  lot_no:string
  item_name:string
  line_no:number
  marketing_indent_no:string
  no_of_bags:number
  quantity: number
  sales_type: string
  total_amount: number
  unit_price: number
  variety_group: string
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
