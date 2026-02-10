import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router";
import { Landing } from "../src/pages/Landing";
import { Onboarding } from "../src/pages/Onboarding";
import { Dashboard } from "../src/pages/Dashboard";
import { PaymentHistoryPage } from "../src/pages/PaymentHistory";
import { ProfilePage } from "../src/pages/Profile";
import { CreatePaymentLinkPage } from "../src/pages/CreatePaymentLink";
import { PayPage } from "../src/pages/PayPage";
import { OrderDetailPage } from "../src/pages/OrderDetail";
import { useAuth } from "../src/context/AuthContext";

function ProtectedLayout() {
  const { isAuthenticated, walletAddress } = useAuth();

  if (!isAuthenticated || !walletAddress) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    element: <ProtectedLayout />, 
    children: [
      {
        path: "/onboarding",
        element: <Onboarding />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />
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
        path: "/pay/:token",
        element: <PayPage />
      },
      {
        path: "/profile",
        element: <ProfilePage />
      }
    
    ],
  },
]);
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
