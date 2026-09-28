import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { LoginModal } from "./components/layout/LoginModal";
import { Toast } from "./components/layout/Toast";
import { HomeSkeleton } from "./components/skeletons/HomeSkeleton";
import { ProfileSkeleton } from "./components/skeletons/ProfileSkeleton";
import { ComingSoonSkeleton } from "./components/skeletons/ComingSoonSkeleton";
import { NetworkSkeleton } from "./components/skeletons/NetworkSkeleton";

// Each screen is its own chunk; its own skeleton shimmers in its place while it loads.
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const Profile = lazy(() =>
  import("./pages/Profile").then((m) => ({ default: m.Profile })),
);
const Network = lazy(() =>
  import("./pages/Network").then((m) => ({ default: m.Network })),
);
const Bookings = lazy(() =>
  import("./pages/Bookings").then((m) => ({ default: m.Bookings })),
);

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
            <Route
              path="/home"
              element={
                <Suspense fallback={<HomeSkeleton />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="/network"
              element={
                <Suspense fallback={<NetworkSkeleton />}>
                  <Network />
                </Suspense>
              }
            />
            <Route
              path="/bookings"
              element={
                <Suspense fallback={<ComingSoonSkeleton label="bookings" />}>
                  <Bookings />
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <Suspense fallback={<ProfileSkeleton />}>
                  <Profile />
                </Suspense>
              }
            />
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
