export class Pickmodel {
    condition: string
    message: string;
    action: string;
    pick_no: string;
    pick_line_no: string;
    pick_zone: string;
    priority: string;
    barcode: string;
    bincode: string;
    qty_ordered: string;
    item_code: string;
    qty_picked: string;
    description: string;
    color: string;
    size: string;
    style: string;
    shift_name: string;
    shift_id: string;
    tray: string;
    images: PickImageModel;
}

export class PickImageModel {
    img1: string;
    img2: string;
    img3: string;
    img4: string;
}
