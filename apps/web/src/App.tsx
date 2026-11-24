import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./auth";
import { LoginPage } from "./pages/LoginPage";
import { LoanListPage } from "./pages/LoanListPage";
import { LoanDetailPage } from "./pages/LoanDetailPage";
import { EarlyRepaymentPage } from "./pages/EarlyRepaymentPage";

function RequireLogin({ children }: { children: ReactNode }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loans" element={<RequireLogin><LoanListPage /></RequireLogin>} />
      <Route path="/loans/:id" element={<RequireLogin><LoanDetailPage /></RequireLogin>} />
      <Route path="/loans/:id/early-repayment" element={<RequireLogin><EarlyRepaymentPage /></RequireLogin>} />
      <Route path="*" element={<Navigate to="/loans" replace />} />
    </Routes>
  );
}
