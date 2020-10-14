export class IqcHeader {
    condition: string;
    grn_no: string;
    grn_created_datetime: string;
    document_no: string;
    document_type: string;
    external_document_no: string;
    external_document_date: string;
    grn_quantity: string;
    vendor_no: string;
    vendor_name: string;
}

export class IQCLine {
    bincode: string;
    condition: string;
    barcode: string;
    grn_line_no: number;
    rejection_reason: string;
    qty: string;
    vendor_lot_no: string;
    expire_date: string;
    item_no: string;
}

export class IQC {
    header: IqcHeader[];
    lines: IQCLine[];
}

export class IQCBarcode {
    condition: string;
    barcode: string;

    accepted_qty: number;
    rejected_qty: number;
    qty: string;
    item_no: string;
}