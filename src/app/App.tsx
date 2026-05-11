import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CurrencyProvider } from "./context/CurrencyContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <CurrencyProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" theme="dark" />
    </CurrencyProvider>
  );
}