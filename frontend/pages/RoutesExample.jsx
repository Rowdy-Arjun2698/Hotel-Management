/**
 * Example route wiring for the customer flow.
 * Drop this inside your existing <Routes> under the "/customer/:tableId" layout route
 * (wherever MorePage is currently mounted). Adjust the parent path/element to match
 * your actual layout component.
 */
import { Routes, Route } from "react-router-dom";

import MorePage from "./pages/MorePage";
import MyBillPage from "./pages/MyBillPage";
import RequestBillPage from "./pages/RequestBillPage";
import BillPreviewPage from "./pages/BillPreviewPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PaymentProcessingPage from "./pages/PaymentProcessingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import RateFoodPage from "./pages/RateFoodPage";
import CallWaiterPage from "./pages/CallWaiterPage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import AboutUsPage from "./pages/AboutUsPage";

const CustomerRoutes = () => (
  <Routes>
    {/* 1. More menu */}
    <Route path="more" element={<MorePage />} />

    {/* Existing "My Bill" viewer (paid/unpaid summary) */}
    <Route path="more/bill" element={<MyBillPage />} />

    {/* 2-3. Request bill -> checking / not ready / all served */}
    <Route path="more/request-bill" element={<RequestBillPage />} />

    {/* 4. Bill preview -> Proceed to Pay */}
    <Route path="more/bill-preview" element={<BillPreviewPage />} />

    {/* 5. Payment method + processing */}
    <Route path="more/payment" element={<PaymentMethodPage />} />
    <Route path="more/payment-processing" element={<PaymentProcessingPage />} />

    {/* 6. Payment success */}
    <Route path="more/payment-success" element={<PaymentSuccessPage />} />

    {/* 7. Rate your food */}
    <Route path="more/feedback" element={<RateFoodPage />} />

    {/* 8. Call waiter */}
    <Route path="more/call-waiter" element={<CallWaiterPage />} />

    {/* 9. Notifications */}
    <Route path="notifications" element={<NotificationsPage />} />

    {/* 10. Help & About */}
    <Route path="more/help" element={<HelpSupportPage />} />
    <Route path="more/about" element={<AboutUsPage />} />
  </Routes>
);

export default CustomerRoutes;
