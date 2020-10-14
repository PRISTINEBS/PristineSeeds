export class returnbsioheader{
  condition:string
  document_no:string
  bsio_no:string
  customer_no:string
  order_datetime:string
  order_status:string
  sales_type:string
  season:string
  created_by:string
  created_on:string
  rbl : Array<returnbsioline> = []
}

export class returnbsioline {
  item_no:string
  item_group:string
  item_name:string
  stage:string
  male_female:string
  item_class_of_seed:string
  lot_no:string
  no_of_bags:number
  quantity:number
  unit_price:number
  line_amount:number
  line_discount:number
}
