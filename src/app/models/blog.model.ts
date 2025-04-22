/**
 * Blog Model
 * 
 * This interface defines the structure of a blog post in the application.
 * It represents the data contract between the frontend and backend API.
 * 
 * Properties:
 * - id: Unique identifier for the blog post (assigned by the backend)
 * - title: The headline/title of the blog post
 * - content: The main text content of the blog post
 * - date: When the blog was created or last updated
 * - created_by: Username of the person who created the blog
 * 
 * This model is used throughout the application for:
 * - Displaying blog posts in the Home component
 * - Editing blogs in the EditBlog component
 * - Type-checking API responses in the BlogService
 */
export interface Blog {
  id: number;
  title: string;
  content: string;
  date: Date;
  created_by: string;
}