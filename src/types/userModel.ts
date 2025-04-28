export type UserData = {
  email?: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  uid: string;
};

export type User = {
  uid: string;
  display_name: string;
  email: string;
  phone_number: number;
  photo_url: string;
  favorites: string[];
  address_city: string;
  address_street_address: string;
  address_zip_code: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
}