import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { Chatbot } from "./Chatbot";

export function Root() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className={isHomePage ? "" : "pt-16"}>
        <Outlet />
      </main>
      {!isHomePage && <Chatbot />}
    </div>
  );
}