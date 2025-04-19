/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RedirectImport } from './routes/redirect'
import { Route as AppAppImport } from './routes/app/_app'
import { Route as marketingLandingImport } from './routes/(marketing)/_landing'
import { Route as authAuthImport } from './routes/(auth)/_auth'
import { Route as AppAppIndexImport } from './routes/app/_app/index'
import { Route as marketingLandingIndexImport } from './routes/(marketing)/_landing/index'
import { Route as AppAppPlaygroundImport } from './routes/app/_app/playground'
import { Route as AppAppLogsImport } from './routes/app/_app/logs'
import { Route as AppAppKeysImport } from './routes/app/_app/keys'
import { Route as marketingLandingPlaygroundImport } from './routes/(marketing)/_landing/playground'
import { Route as authAuthSignupImport } from './routes/(auth)/_auth.signup'
import { Route as authAuthSigninImport } from './routes/(auth)/_auth.signin'
import { Route as marketingLandingUpdatesIndexImport } from './routes/(marketing)/_landing/updates.index'
import { Route as marketingLandingBlogIndexImport } from './routes/(marketing)/_landing/blog.index'
import { Route as marketingLandingUpdatesSlugImport } from './routes/(marketing)/_landing/updates.$slug'
import { Route as marketingLandingBlogSlugImport } from './routes/(marketing)/_landing/blog.$slug'
import { Route as marketingLandingBlogCCategoryImport } from './routes/(marketing)/_landing/blog.c.$category'

// Create Virtual Routes

const AppImport = createFileRoute('/app')()
const marketingImport = createFileRoute('/(marketing)')()
const authImport = createFileRoute('/(auth)')()

// Create/Update Routes

const AppRoute = AppImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => rootRoute,
} as any)

const marketingRoute = marketingImport.update({
  id: '/(marketing)',
  getParentRoute: () => rootRoute,
} as any)

const authRoute = authImport.update({
  id: '/(auth)',
  getParentRoute: () => rootRoute,
} as any)

const RedirectRoute = RedirectImport.update({
  id: '/redirect',
  path: '/redirect',
  getParentRoute: () => rootRoute,
} as any)

const AppAppRoute = AppAppImport.update({
  id: '/_app',
  getParentRoute: () => AppRoute,
} as any)

const marketingLandingRoute = marketingLandingImport.update({
  id: '/_landing',
  getParentRoute: () => marketingRoute,
} as any)

const authAuthRoute = authAuthImport.update({
  id: '/_auth',
  getParentRoute: () => authRoute,
} as any)

const AppAppIndexRoute = AppAppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppAppRoute,
} as any)

const marketingLandingIndexRoute = marketingLandingIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => marketingLandingRoute,
} as any)

const AppAppPlaygroundRoute = AppAppPlaygroundImport.update({
  id: '/playground',
  path: '/playground',
  getParentRoute: () => AppAppRoute,
} as any)

const AppAppLogsRoute = AppAppLogsImport.update({
  id: '/logs',
  path: '/logs',
  getParentRoute: () => AppAppRoute,
} as any)

const AppAppKeysRoute = AppAppKeysImport.update({
  id: '/keys',
  path: '/keys',
  getParentRoute: () => AppAppRoute,
} as any)

const marketingLandingPlaygroundRoute = marketingLandingPlaygroundImport.update(
  {
    id: '/playground',
    path: '/playground',
    getParentRoute: () => marketingLandingRoute,
  } as any,
)

const authAuthSignupRoute = authAuthSignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => authAuthRoute,
} as any)

const authAuthSigninRoute = authAuthSigninImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => authAuthRoute,
} as any)

const marketingLandingUpdatesIndexRoute =
  marketingLandingUpdatesIndexImport.update({
    id: '/updates/',
    path: '/updates/',
    getParentRoute: () => marketingLandingRoute,
  } as any)

const marketingLandingBlogIndexRoute = marketingLandingBlogIndexImport.update({
  id: '/blog/',
  path: '/blog/',
  getParentRoute: () => marketingLandingRoute,
} as any)

const marketingLandingUpdatesSlugRoute =
  marketingLandingUpdatesSlugImport.update({
    id: '/updates/$slug',
    path: '/updates/$slug',
    getParentRoute: () => marketingLandingRoute,
  } as any)

const marketingLandingBlogSlugRoute = marketingLandingBlogSlugImport.update({
  id: '/blog/$slug',
  path: '/blog/$slug',
  getParentRoute: () => marketingLandingRoute,
} as any)

const marketingLandingBlogCCategoryRoute =
  marketingLandingBlogCCategoryImport.update({
    id: '/blog/c/$category',
    path: '/blog/c/$category',
    getParentRoute: () => marketingLandingRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/redirect': {
      id: '/redirect'
      path: '/redirect'
      fullPath: '/redirect'
      preLoaderRoute: typeof RedirectImport
      parentRoute: typeof rootRoute
    }
    '/(auth)': {
      id: '/(auth)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/_auth': {
      id: '/(auth)/_auth'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authAuthImport
      parentRoute: typeof authRoute
    }
    '/(marketing)': {
      id: '/(marketing)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof marketingImport
      parentRoute: typeof rootRoute
    }
    '/(marketing)/_landing': {
      id: '/(marketing)/_landing'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof marketingLandingImport
      parentRoute: typeof marketingRoute
    }
    '/app': {
      id: '/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/app/_app': {
      id: '/app/_app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppAppImport
      parentRoute: typeof AppRoute
    }
    '/(auth)/_auth/signin': {
      id: '/(auth)/_auth/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof authAuthSigninImport
      parentRoute: typeof authAuthImport
    }
    '/(auth)/_auth/signup': {
      id: '/(auth)/_auth/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authAuthSignupImport
      parentRoute: typeof authAuthImport
    }
    '/(marketing)/_landing/playground': {
      id: '/(marketing)/_landing/playground'
      path: '/playground'
      fullPath: '/playground'
      preLoaderRoute: typeof marketingLandingPlaygroundImport
      parentRoute: typeof marketingLandingImport
    }
    '/app/_app/keys': {
      id: '/app/_app/keys'
      path: '/keys'
      fullPath: '/app/keys'
      preLoaderRoute: typeof AppAppKeysImport
      parentRoute: typeof AppAppImport
    }
    '/app/_app/logs': {
      id: '/app/_app/logs'
      path: '/logs'
      fullPath: '/app/logs'
      preLoaderRoute: typeof AppAppLogsImport
      parentRoute: typeof AppAppImport
    }
    '/app/_app/playground': {
      id: '/app/_app/playground'
      path: '/playground'
      fullPath: '/app/playground'
      preLoaderRoute: typeof AppAppPlaygroundImport
      parentRoute: typeof AppAppImport
    }
    '/(marketing)/_landing/': {
      id: '/(marketing)/_landing/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof marketingLandingIndexImport
      parentRoute: typeof marketingLandingImport
    }
    '/app/_app/': {
      id: '/app/_app/'
      path: '/'
      fullPath: '/app/'
      preLoaderRoute: typeof AppAppIndexImport
      parentRoute: typeof AppAppImport
    }
    '/(marketing)/_landing/blog/$slug': {
      id: '/(marketing)/_landing/blog/$slug'
      path: '/blog/$slug'
      fullPath: '/blog/$slug'
      preLoaderRoute: typeof marketingLandingBlogSlugImport
      parentRoute: typeof marketingLandingImport
    }
    '/(marketing)/_landing/updates/$slug': {
      id: '/(marketing)/_landing/updates/$slug'
      path: '/updates/$slug'
      fullPath: '/updates/$slug'
      preLoaderRoute: typeof marketingLandingUpdatesSlugImport
      parentRoute: typeof marketingLandingImport
    }
    '/(marketing)/_landing/blog/': {
      id: '/(marketing)/_landing/blog/'
      path: '/blog'
      fullPath: '/blog'
      preLoaderRoute: typeof marketingLandingBlogIndexImport
      parentRoute: typeof marketingLandingImport
    }
    '/(marketing)/_landing/updates/': {
      id: '/(marketing)/_landing/updates/'
      path: '/updates'
      fullPath: '/updates'
      preLoaderRoute: typeof marketingLandingUpdatesIndexImport
      parentRoute: typeof marketingLandingImport
    }
    '/(marketing)/_landing/blog/c/$category': {
      id: '/(marketing)/_landing/blog/c/$category'
      path: '/blog/c/$category'
      fullPath: '/blog/c/$category'
      preLoaderRoute: typeof marketingLandingBlogCCategoryImport
      parentRoute: typeof marketingLandingImport
    }
  }
}

// Create and export the route tree

interface authAuthRouteChildren {
  authAuthSigninRoute: typeof authAuthSigninRoute
  authAuthSignupRoute: typeof authAuthSignupRoute
}

const authAuthRouteChildren: authAuthRouteChildren = {
  authAuthSigninRoute: authAuthSigninRoute,
  authAuthSignupRoute: authAuthSignupRoute,
}

const authAuthRouteWithChildren = authAuthRoute._addFileChildren(
  authAuthRouteChildren,
)

interface authRouteChildren {
  authAuthRoute: typeof authAuthRouteWithChildren
}

const authRouteChildren: authRouteChildren = {
  authAuthRoute: authAuthRouteWithChildren,
}

const authRouteWithChildren = authRoute._addFileChildren(authRouteChildren)

interface marketingLandingRouteChildren {
  marketingLandingPlaygroundRoute: typeof marketingLandingPlaygroundRoute
  marketingLandingIndexRoute: typeof marketingLandingIndexRoute
  marketingLandingBlogSlugRoute: typeof marketingLandingBlogSlugRoute
  marketingLandingUpdatesSlugRoute: typeof marketingLandingUpdatesSlugRoute
  marketingLandingBlogIndexRoute: typeof marketingLandingBlogIndexRoute
  marketingLandingUpdatesIndexRoute: typeof marketingLandingUpdatesIndexRoute
  marketingLandingBlogCCategoryRoute: typeof marketingLandingBlogCCategoryRoute
}

const marketingLandingRouteChildren: marketingLandingRouteChildren = {
  marketingLandingPlaygroundRoute: marketingLandingPlaygroundRoute,
  marketingLandingIndexRoute: marketingLandingIndexRoute,
  marketingLandingBlogSlugRoute: marketingLandingBlogSlugRoute,
  marketingLandingUpdatesSlugRoute: marketingLandingUpdatesSlugRoute,
  marketingLandingBlogIndexRoute: marketingLandingBlogIndexRoute,
  marketingLandingUpdatesIndexRoute: marketingLandingUpdatesIndexRoute,
  marketingLandingBlogCCategoryRoute: marketingLandingBlogCCategoryRoute,
}

const marketingLandingRouteWithChildren =
  marketingLandingRoute._addFileChildren(marketingLandingRouteChildren)

interface marketingRouteChildren {
  marketingLandingRoute: typeof marketingLandingRouteWithChildren
}

const marketingRouteChildren: marketingRouteChildren = {
  marketingLandingRoute: marketingLandingRouteWithChildren,
}

const marketingRouteWithChildren = marketingRoute._addFileChildren(
  marketingRouteChildren,
)

interface AppAppRouteChildren {
  AppAppKeysRoute: typeof AppAppKeysRoute
  AppAppLogsRoute: typeof AppAppLogsRoute
  AppAppPlaygroundRoute: typeof AppAppPlaygroundRoute
  AppAppIndexRoute: typeof AppAppIndexRoute
}

const AppAppRouteChildren: AppAppRouteChildren = {
  AppAppKeysRoute: AppAppKeysRoute,
  AppAppLogsRoute: AppAppLogsRoute,
  AppAppPlaygroundRoute: AppAppPlaygroundRoute,
  AppAppIndexRoute: AppAppIndexRoute,
}

const AppAppRouteWithChildren =
  AppAppRoute._addFileChildren(AppAppRouteChildren)

interface AppRouteChildren {
  AppAppRoute: typeof AppAppRouteWithChildren
}

const AppRouteChildren: AppRouteChildren = {
  AppAppRoute: AppAppRouteWithChildren,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

export interface FileRoutesByFullPath {
  '/redirect': typeof RedirectRoute
  '/': typeof marketingLandingIndexRoute
  '/app': typeof AppAppRouteWithChildren
  '/signin': typeof authAuthSigninRoute
  '/signup': typeof authAuthSignupRoute
  '/playground': typeof marketingLandingPlaygroundRoute
  '/app/keys': typeof AppAppKeysRoute
  '/app/logs': typeof AppAppLogsRoute
  '/app/playground': typeof AppAppPlaygroundRoute
  '/app/': typeof AppAppIndexRoute
  '/blog/$slug': typeof marketingLandingBlogSlugRoute
  '/updates/$slug': typeof marketingLandingUpdatesSlugRoute
  '/blog': typeof marketingLandingBlogIndexRoute
  '/updates': typeof marketingLandingUpdatesIndexRoute
  '/blog/c/$category': typeof marketingLandingBlogCCategoryRoute
}

export interface FileRoutesByTo {
  '/redirect': typeof RedirectRoute
  '/': typeof marketingLandingIndexRoute
  '/app': typeof AppAppIndexRoute
  '/signin': typeof authAuthSigninRoute
  '/signup': typeof authAuthSignupRoute
  '/playground': typeof marketingLandingPlaygroundRoute
  '/app/keys': typeof AppAppKeysRoute
  '/app/logs': typeof AppAppLogsRoute
  '/app/playground': typeof AppAppPlaygroundRoute
  '/blog/$slug': typeof marketingLandingBlogSlugRoute
  '/updates/$slug': typeof marketingLandingUpdatesSlugRoute
  '/blog': typeof marketingLandingBlogIndexRoute
  '/updates': typeof marketingLandingUpdatesIndexRoute
  '/blog/c/$category': typeof marketingLandingBlogCCategoryRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/redirect': typeof RedirectRoute
  '/(auth)': typeof authRouteWithChildren
  '/(auth)/_auth': typeof authAuthRouteWithChildren
  '/(marketing)': typeof marketingRouteWithChildren
  '/(marketing)/_landing': typeof marketingLandingRouteWithChildren
  '/app': typeof AppRouteWithChildren
  '/app/_app': typeof AppAppRouteWithChildren
  '/(auth)/_auth/signin': typeof authAuthSigninRoute
  '/(auth)/_auth/signup': typeof authAuthSignupRoute
  '/(marketing)/_landing/playground': typeof marketingLandingPlaygroundRoute
  '/app/_app/keys': typeof AppAppKeysRoute
  '/app/_app/logs': typeof AppAppLogsRoute
  '/app/_app/playground': typeof AppAppPlaygroundRoute
  '/(marketing)/_landing/': typeof marketingLandingIndexRoute
  '/app/_app/': typeof AppAppIndexRoute
  '/(marketing)/_landing/blog/$slug': typeof marketingLandingBlogSlugRoute
  '/(marketing)/_landing/updates/$slug': typeof marketingLandingUpdatesSlugRoute
  '/(marketing)/_landing/blog/': typeof marketingLandingBlogIndexRoute
  '/(marketing)/_landing/updates/': typeof marketingLandingUpdatesIndexRoute
  '/(marketing)/_landing/blog/c/$category': typeof marketingLandingBlogCCategoryRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/redirect'
    | '/'
    | '/app'
    | '/signin'
    | '/signup'
    | '/playground'
    | '/app/keys'
    | '/app/logs'
    | '/app/playground'
    | '/app/'
    | '/blog/$slug'
    | '/updates/$slug'
    | '/blog'
    | '/updates'
    | '/blog/c/$category'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/redirect'
    | '/'
    | '/app'
    | '/signin'
    | '/signup'
    | '/playground'
    | '/app/keys'
    | '/app/logs'
    | '/app/playground'
    | '/blog/$slug'
    | '/updates/$slug'
    | '/blog'
    | '/updates'
    | '/blog/c/$category'
  id:
    | '__root__'
    | '/redirect'
    | '/(auth)'
    | '/(auth)/_auth'
    | '/(marketing)'
    | '/(marketing)/_landing'
    | '/app'
    | '/app/_app'
    | '/(auth)/_auth/signin'
    | '/(auth)/_auth/signup'
    | '/(marketing)/_landing/playground'
    | '/app/_app/keys'
    | '/app/_app/logs'
    | '/app/_app/playground'
    | '/(marketing)/_landing/'
    | '/app/_app/'
    | '/(marketing)/_landing/blog/$slug'
    | '/(marketing)/_landing/updates/$slug'
    | '/(marketing)/_landing/blog/'
    | '/(marketing)/_landing/updates/'
    | '/(marketing)/_landing/blog/c/$category'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  RedirectRoute: typeof RedirectRoute
  authRoute: typeof authRouteWithChildren
  marketingRoute: typeof marketingRouteWithChildren
  AppRoute: typeof AppRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  RedirectRoute: RedirectRoute,
  authRoute: authRouteWithChildren,
  marketingRoute: marketingRouteWithChildren,
  AppRoute: AppRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/redirect",
        "/(auth)",
        "/(marketing)",
        "/app"
      ]
    },
    "/redirect": {
      "filePath": "redirect.tsx"
    },
    "/(auth)": {
      "filePath": "(auth)",
      "children": [
        "/(auth)/_auth"
      ]
    },
    "/(auth)/_auth": {
      "filePath": "(auth)/_auth.tsx",
      "parent": "/(auth)",
      "children": [
        "/(auth)/_auth/signin",
        "/(auth)/_auth/signup"
      ]
    },
    "/(marketing)": {
      "filePath": "(marketing)",
      "children": [
        "/(marketing)/_landing"
      ]
    },
    "/(marketing)/_landing": {
      "filePath": "(marketing)/_landing.tsx",
      "parent": "/(marketing)",
      "children": [
        "/(marketing)/_landing/playground",
        "/(marketing)/_landing/",
        "/(marketing)/_landing/blog/$slug",
        "/(marketing)/_landing/updates/$slug",
        "/(marketing)/_landing/blog/",
        "/(marketing)/_landing/updates/",
        "/(marketing)/_landing/blog/c/$category"
      ]
    },
    "/app": {
      "filePath": "app",
      "children": [
        "/app/_app"
      ]
    },
    "/app/_app": {
      "filePath": "app/_app.tsx",
      "parent": "/app",
      "children": [
        "/app/_app/keys",
        "/app/_app/logs",
        "/app/_app/playground",
        "/app/_app/"
      ]
    },
    "/(auth)/_auth/signin": {
      "filePath": "(auth)/_auth.signin.tsx",
      "parent": "/(auth)/_auth"
    },
    "/(auth)/_auth/signup": {
      "filePath": "(auth)/_auth.signup.tsx",
      "parent": "/(auth)/_auth"
    },
    "/(marketing)/_landing/playground": {
      "filePath": "(marketing)/_landing/playground.tsx",
      "parent": "/(marketing)/_landing"
    },
    "/app/_app/keys": {
      "filePath": "app/_app/keys.tsx",
      "parent": "/app/_app"
    },
    "/app/_app/logs": {
      "filePath": "app/_app/logs.tsx",
      "parent": "/app/_app"
    },
    "/app/_app/playground": {
      "filePath": "app/_app/playground.tsx",
      "parent": "/app/_app"
    },
    "/(marketing)/_landing/": {
      "filePath": "(marketing)/_landing/index.tsx",
      "parent": "/(marketing)/_landing"
    },
    "/app/_app/": {
      "filePath": "app/_app/index.tsx",
      "parent": "/app/_app"
    },
    "/(marketing)/_landing/blog/$slug": {
      "filePath": "(marketing)/_landing/blog.$slug.tsx",
      "parent": "/(marketing)/_landing"
    },
    "/(marketing)/_landing/updates/$slug": {
      "filePath": "(marketing)/_landing/updates.$slug.tsx",
      "parent": "/(marketing)/_landing"
    },
    "/(marketing)/_landing/blog/": {
      "filePath": "(marketing)/_landing/blog.index.tsx",
      "parent": "/(marketing)/_landing"
    },
    "/(marketing)/_landing/updates/": {
      "filePath": "(marketing)/_landing/updates.index.tsx",
      "parent": "/(marketing)/_landing"
    },
    "/(marketing)/_landing/blog/c/$category": {
      "filePath": "(marketing)/_landing/blog.c.$category.tsx",
      "parent": "/(marketing)/_landing"
    }
  }
}
ROUTE_MANIFEST_END */
