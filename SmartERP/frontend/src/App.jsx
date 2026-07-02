import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Ledger from "./pages/Ledger";
import Invoice from "./pages/Invoice";
import Reports from "./pages/Reports";
import Company from "./pages/Company";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/company" element={<Company />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;