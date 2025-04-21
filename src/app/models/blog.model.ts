/**
 * Represents a blog entry in the application
 */
export interface Blog {
  id: number;
  title: string;
  content: string;
  date: Date;
  created_by: string;
}