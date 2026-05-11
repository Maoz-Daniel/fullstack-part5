import { createElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AlbumPhotosPage } from '../pages/AlbumPhotos/AlbumPhotosPage.jsx'
import { AlbumsPage } from '../pages/Albums/AlbumsPage.jsx'
import { HomePage } from '../pages/Home/HomePage.jsx'
import { LoginPage } from '../pages/Login/LoginPage.jsx'
import { PostDetailsPage } from '../pages/PostDetails/PostDetailsPage.jsx'
import { PostsPage } from '../pages/Posts/PostsPage.jsx'
import { RegisterPage } from '../pages/Register/RegisterPage.jsx'
import { TodosPage } from '../pages/Todos/TodosPage.jsx'
import {
  authLandingLoader,
  publicOnlyLoader,
  requireAuthLoader,
  requireMatchingUserLoader,
} from './loaders.js'
import { ProtectedLayout } from './ProtectedLayout.jsx'
import { RootLayout } from './RootLayout.jsx'
import { RouteErrorPage } from './RouteErrorPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(RootLayout),
    errorElement: createElement(RouteErrorPage),
    children: [
      {
        index: true,
        loader: authLandingLoader,
      },
      {
        loader: publicOnlyLoader,
        children: [
          {
            path: 'login',
            element: createElement(LoginPage),
          },
          {
            path: 'register',
            element: createElement(RegisterPage),
          },
        ],
      },
      {
        id: 'protected',
        loader: requireAuthLoader,
        element: createElement(ProtectedLayout),
        children: [
          {
            path: 'home',
            element: createElement(HomePage),
          },
          {
            path: 'todos',
            element: createElement(TodosPage),
          },
          {
            path: 'posts',
            element: createElement(PostsPage),
          },
          {
            path: 'albums',
            element: createElement(AlbumsPage),
          },
          {
            path: 'users/:userId/posts/:postId',
            loader: requireMatchingUserLoader,
            element: createElement(PostDetailsPage),
          },
          {
            path: 'users/:userId/albums/:albumId/photos',
            loader: requireMatchingUserLoader,
            element: createElement(AlbumPhotosPage),
          },
        ],
      },
    ],
  },
])
