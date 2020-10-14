export class Vendorcataloguemodel {
    vendor_no: string
    vendor_name: string
    item_code: string
    vendor_item_code: string
    cost_per_unit: number
    gst_percentage: number
    description: string

}

export class VendorDetailModel {
    vendor_no: number;
    vendor_name: string

}

export class ItemListModel {
    condition: string;
    item_no: string;
    name: string;

}