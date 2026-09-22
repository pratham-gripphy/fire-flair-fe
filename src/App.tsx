import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';

function App() {
  return (
    <AppProvider>
      <div className="ff-shell">
        <Header />
        <main className="ff-main">
          <Home />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
