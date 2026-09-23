import { AppProvider } from './context/AppContext';
import { useStore } from './hooks/useStore';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Network } from './pages/Network';
import { Bookings } from './pages/Bookings';

function AppRoutes() {
  const { state } = useStore();
  switch (state.tab) {
    case 'profile':
      return <Profile />;
    case 'network':
      return <Network />;
    case 'bookings':
      return <Bookings />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <AppProvider>
      <div className="ff-shell">
        <Header />
        <main className="ff-main">
          <AppRoutes />
        </main>
        <BottomNav />
      </div>
    </AppProvider>
  );
}

export default App;
