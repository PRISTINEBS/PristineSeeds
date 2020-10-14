export class Saleorderviewmodel {
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