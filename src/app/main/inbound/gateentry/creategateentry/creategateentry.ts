export class VendorList {
    condition: string;
    message: string;
    vendor_no: string;
    vendor_name: string;
}

export class Order {
    condition: string;
    message: string;
    document_no: string;
}

export class LocationList {
    condition: string;
    message: string;
    location_id: string;
    location_name: string;
}

export class GateEntryLines {
  condition: string;
  message: string;
  challan_no: string;
  challan_date: string;
  crop: string;
  description: string;
  baseuomid: string;
  baseuom: number;
  no_of_bags: number;
  quantity: number;
}

