import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewBlogComponent } from './components/new-blog/new-blog.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'blog/new', component: NewBlogComponent },
  { path: 'blog/edit/:id', component: EditBlogComponent },
  { path: '**', redirectTo: '' }
];
