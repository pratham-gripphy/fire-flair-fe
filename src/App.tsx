import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { LoginModal } from "./components/layout/LoginModal";
import { Toast } from "./components/layout/Toast";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Network } from "./pages/Network";
import { Bookings } from "./pages/Bookings";

function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <AppProvider>
      <div className="ff-shell">
        <Header onLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        <main className="ff-main">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/network" element={<Network />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
        <BottomNav />
        <Toast />
      </div>
    </AppProvider>
  );
}

export default App;
