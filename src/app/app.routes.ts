import { Routes } from "@angular/router";
import { authGuard }   from "./guards/auth.guard";
import { noAuthGuard } from "./guards/no-auth.guard";
 
export const routes: Routes = [
  // Públicas
  { path: "login",   loadComponent: () => import("./login/login.page").then(m => m.LoginPage),   canActivate: [noAuthGuard] },
  { path: "welcome", loadComponent: () => import("./welcome/welcome.page").then(m => m.WelcomePage), canActivate: [noAuthGuard] },
 
  // Protegidas — DUOC Connect
  { path: "home",        loadComponent: () => import("./home/home.page").then(m => m.HomePage),             canActivate: [authGuard] },
  { path: "create-post", loadComponent: () => import("./create-post/create-post.page").then(m => m.CreatePostPage), canActivate: [authGuard] },
  { path: "categories",  loadComponent: () => import("./categories/categories.page").then(m => m.CategoriesPage), canActivate: [authGuard] },
  { path: "post/:id",    loadComponent: () => import("./post-detail/post-detail.page").then(m => m.PostDetailPage), canActivate: [authGuard] },
 
  // Skeleton original
  { path: "map",    loadComponent: () => import("./map/map.page").then(m => m.MapPage),       canActivate: [authGuard] },
  { path: "camera", loadComponent: () => import("./camera/camera.page").then(m => m.CameraPage), canActivate: [authGuard] },
 
  // Fallback
  { path: "",   redirectTo: "welcome", pathMatch: "full" },
  { path: "**", loadComponent: () => import("./not-found/not-found.page").then(m => m.NotFoundPage) },
];
