export interface CampaignDetailUser {
  id: string;
  initials: string;
  fullname: string;
  staff_email: string;
  role: string;
  last_login: any;
  member_since: any;
}

export type AddCampaignUserFormData = {
  email: string;
  business_id: string;
  role: string | number;
  fullname: string;
  project_id: any;
};

export type AddCampaignUserErrors = {
  email: string;
  business_id: string;
  role: string;
  fullname: string;
};
