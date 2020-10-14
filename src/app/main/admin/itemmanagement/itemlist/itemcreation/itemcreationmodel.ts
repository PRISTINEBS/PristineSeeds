export class categorymodel {
    id: number
    code: string
    name: string
    sub_id: string
    description: string
    created_by: string

}

export class subcategorymodel {
    id: number
    code: string
    name: string
    sub_id: string
    description: string
    created_by: string

}

export class GstGroupIdModel {
    gst_group_id: number;
    gst_group: string;
}

export class GstHsnCodeModel {
    hsn_id: number;
    gst_group_id: number;
    description: string;

}

export class BaseUomCodeModel {
    id: number;
    name: number;
}

export class  ItemGroupModel {
  id:number
  class_of_seed:string
  item_no: string
  male_female: string

}
