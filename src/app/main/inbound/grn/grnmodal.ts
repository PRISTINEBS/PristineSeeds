export class Grnmodal {
    condition: string;
    grn_no: string;
    grn_status: string;
    grn_created_by: string;
    grn_created_datetime: string;
}

export class Documentlist {
    condition: string;
    message: string;
    document_no: string;
}

export class DocumentInfo {

    documentData: Array<{
        condition: string;
        document_no: string;
        vendor_name: string;
        vendor_country: string;
        order_date: string;
        ordered_qty: string;
        received_quantity: string
    }>;
    grnData: Array<Grnmodal>;
}

export class GrnInfo {
    condition: string;
    message: string;
    gate_entry_no: string;
    grn_no: string;
    location_name: string;
    grn_created_by: string;
    grn_created_datetime: string;
    document_type: string;
    document_no: string;
    external_document_no: string;
    bill_of_entry_no: string;
    bil_of_entry_date: string;
    bil_of_entry_amount: number;
    item_no: string;
    item_Info: string;
    document_line_no: number;
    document_quantity: number;
    received_quantity: number;
    expiry_Date: number;
    vendor_Lotno: number;
    grn_quantity: number;
    new_quantity: number;
    new_barcode: number;
    user_enter_lotno: string;
    sales_invoice_no: string;
    user_enter_expiry_Date: Date;
}


export class BarcodeInfo {
    condition: string;
    select: number;
    position: number;
    item_no: string;
    barcode: string;
    accepted_qty: number;
    barcode_batch_id: number;
    is_printed: number;
}