import { CartManager } from "./CartManager";
import "@/ui/App.css";
import "@/index.css";

export function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <h1 className="title">Retour Vers Le Futur</h1>
          <p className="subtitle">La Trilogie Légendaire en DVD</p>
        </div>
        <div className="badge">Collection Temporelle</div>
      </header>
      <main>
        <CartManager />
      </main>
      <footer className="footer">
        <p>© 2000 Cinéphile Store. Hill Valley. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
