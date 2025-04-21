/**
 * Represents the authentication token response from the API
 */
export interface AuthResponse {
  token: string;
}

/**
 * Represents user credentials for login
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Represents the authenticated user information
 */
export interface User {
  username: string;
}