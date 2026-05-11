import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Portfolio } from "./pages/Portfolio";
import { News } from "./pages/News";
import { NotFound } from "./pages/NotFound";
import AuthPage from "./auth/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: Root,
        children: [
          { index: true, Component: Home },
          { path: "dashboard", Component: Dashboard },
          { path: "portfolio", Component: Portfolio },
          { path: "news", Component: News },
          { path: "*", Component: NotFound },
        ],
      },
    ],
  },
]);