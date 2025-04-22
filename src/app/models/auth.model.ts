/**
 * Authentication Models
 * 
 * This file contains interfaces related to authentication in the application.
 * These models define the structure of data used during the authentication process.
 */

/**
 * AuthResponse Interface
 * 
 * Represents the response from the authentication API after successful login.
 * Contains the JWT token that will be used for authenticating subsequent requests.
 * 
 * Properties:
 * - token: JSON Web Token (JWT) string that contains encoded user information
 *          and is used for authenticating API requests
 * 
 * This token is:
 * - Stored in localStorage
 * - Added to HTTP headers for authenticated requests
 * - Used to determine if a user is currently logged in
 */
export interface AuthResponse {
  token: string;
}

/**
 * UserCredentials Interface
 * 
 * Represents the user input during login.
 * This structure is not directly used in the current implementation but 
 * provides a type definition for potential future form handling.
 * 
 * Properties:
 * - username: The user's unique identifier
 * - password: The user's secret password (should never be stored in plain text)
 * 
 * Security note: This interface is for type checking only. Actual credentials
 * are sent using Basic Auth headers in the current implementation.
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * User Interface
 * 
 * Represents the minimal information about an authenticated user.
 * This model is used to:
 * - Track the currently logged-in user
 * - Display user information in the UI
 * - Check permissions for certain actions
 * 
 * Properties:
 * - username: The unique identifier of the user
 * 
 * Note: In a more complex application, this might include additional
 * properties like roles, display name, email, etc.
 */
export interface User {
  username: string;
}