import { createBrowserRouter, RouterProvider } from "react-router";
import { Landing } from "../src/pages/Landing";
import { Onboarding } from "../src/pages/Onboarding";
import { Dashboard } from "../src/pages/Dashboard";
import { PaymentHistoryPage } from "../src/pages/PaymentHistory";
import { ProfilePage } from "../src/pages/Profile";
import { CreatePaymentLinkPage } from "../src/pages/CreatePaymentLink";
import { PayPage } from "../src/pages/PayPage";
import { OrderDetailPage } from "../src/pages/OrderDetail";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { NowPaymentStatusPage } from "./pages/NowPaymentStatus";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/pay/:token",
    element: <PayPage />
  },
  {
    path: "/nowpayments/status",
    element: <NowPaymentStatusPage />
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute variant="onboarding">
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute variant="dashboard">
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/payments",
    element: <PaymentHistoryPage />
  },
  {
    path: "/create-link",
    element: <CreatePaymentLinkPage />
  },
  {
    path: "/order/:token",
    element: <OrderDetailPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  }
]);
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
