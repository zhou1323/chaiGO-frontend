export interface User {
  email: string;
  id: string;
  username: string;
  [property: string]: any;
}

export interface UserWithToken extends User {
  accessToken: string;
}
