export class PutwayHeader {
    condition: string;
    putway_no: string;
    putway_type: string;
    grn_no: string;
    created_by: string;
    created_on: string;
    item_no: string;
    accepted_qty: string;
    putway_qty: string;
    vendor_lot_no: string;
    expire_date: string;
}

export class Putwayline {
    condition: string;
    select: number;
    position: number;
    putway_no: string;
    putway_line_no: string;
    barcode: string;
    bincode: string;
    quantity: string;
    vendor_lot_no: string;
    expiry_date: string;
}

export class BarcodeLine {
    condition: string;
    item_no: string;
    barcode: string;
    accepted_qty: number;
    rejected_qty: number;
    putway_pending_qty: number;
}


export class Putwayworkmodel {
    header: PutwayHeader[];
    line: Putwayline[];
}