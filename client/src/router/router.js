import { createElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AlbumsPage } from '../pages/Albums/AlbumsPage.jsx'
import { AlbumPhotosPage } from '../pages/Albums/AlbumPhotosPage/AlbumPhotosPage.jsx'
import { HomePage } from '../pages/Home/HomePage.jsx'
import { LoginPage } from '../pages/Login/LoginPage.jsx'
import { PostsPage } from '../pages/Posts/PostsPage.jsx'
import { PostDetailsPage } from '../pages/Posts/PostDetailsPage/PostDetailsPage.jsx'
import { RegisterPage } from '../pages/Register/RegisterPage.jsx'
import { TodosPage } from '../pages/Todos/TodosPage.jsx'
import {albumPhotosLoader,albumsLoader,authLandingLoader,postDetailsLoader,postsLoader,
publicOnlyLoader,requireAuthLoader,todosLoader,} from './loaders.js'
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
        loader: requireAuthLoader, //run on all children routes
        element: createElement(ProtectedLayout),
        children: [
          {
            path: 'home',
            element: createElement(HomePage),
          },
          {
            path: 'todos',
            loader: todosLoader,
            element: createElement(TodosPage),
          },
          {
            path: 'posts',
            loader: postsLoader,
            element: createElement(PostsPage),
          },
          {
            path: 'albums',
            loader: albumsLoader,
            element: createElement(AlbumsPage),
          },
          {
            path: 'users/:userId/posts/:postId',
            loader: postDetailsLoader,
            element: createElement(PostDetailsPage),
          },
          {
            path: 'users/:userId/albums/:albumId/photos',
            loader: albumPhotosLoader,
            element: createElement(AlbumPhotosPage),
          },
        ],
      },
    ],
  },
])
