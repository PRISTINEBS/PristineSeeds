export class PostCode {
  condition: string;
  message: string;
  code: string;
  city: string;
  country: string;
}

export class GeographicalZone {
  condition: string;
  message: string;
  zone: string;
  state: string;
  state_desc: string;
  region: string;
  region_desc: string;
  district: string;
  district_desc: string;
  taluka: string;
  taluka_desc: string;
}

export class StateCode {
  condition: string;
  message: string;
  code: string;
  description: string;
}

export class RegionMaster {
  condition: string;
  message: string;
  code: string;
  name: string;
}
