import { useState, type ChangeEvent } from "react";
import { EXAMPLES, type CartPriceResult } from "@/modules/cart";
import { Receipt } from "./Receipt";
import "./CartManager.css";

export function CartManager() {
  const [items, setItems] = useState("");
  const [result, setResult] = useState<CartPriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExampleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = EXAMPLES.find(
      (example) => example.label === e.target.value,
    );
    if (selected) {
      setItems(selected.value);
      setResult(null);
      setError(null);
    }
  };

  const handleQuickAdd = (movieTitle: string) => {
    setItems((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n${movieTitle}` : movieTitle;
    });
  };

  const handleClear = () => {
    setItems("");
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!items.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cart/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Erreur serveur (${res.status})`);
      }
      const data = (await res.json()) as CartPriceResult;
      setResult(data);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Impossible de contacter le serveur.");
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-grid">
      <div className="glow-panel input-panel">
        <div className="panel-header">
          <span className="dot orange"></span>
          <span className="dot cyan"></span>
          <h2 className="panel-title">COMPOSER VOTRE PANIER</h2>
        </div>

        <form onSubmit={handleSubmit} className="cart-form">
          <div className="form-group">
            <label htmlFor="examples" className="form-label">
              <span className="cyber-accent">⚡</span> CAS DE TEST
              PRÉ-CONFIGURÉS
            </label>
            <div className="select-wrapper">
              <select
                id="examples"
                onChange={handleExampleChange}
                className="cyber-select"
              >
                {EXAMPLES.map((example) => (
                  <option key={example.label} value={example.label}>
                    {example.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="textarea-header">
              <label className="form-label">
                <span className="cyber-accent">📼</span> DVD DANS LE PANIER (1
                par ligne)
              </label>
              {items && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="cyber-clear-btn"
                >
                  [ VIDER ]
                </button>
              )}
            </div>
            <textarea
              value={items}
              onChange={(e) => setItems(e.target.value)}
              rows={6}
              placeholder={`Back to the Future 1\nBack to the Future 2\nBack to the Future 3\nLa chèvre`}
              className="cyber-textarea"
            />
          </div>

          <div className="quick-add-container">
            <span className="quick-add-title">AJOUT RAPIDE (DVD STORE)</span>
            <div className="quick-add-grid">
              <button
                type="button"
                onClick={() => handleQuickAdd("Back to the Future 1")}
                className="dvd-btn episode-1"
              >
                <div className="dvd-disc"></div>
                <span>BTTF 1</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd("Back to the Future 2")}
                className="dvd-btn episode-2"
              >
                <div className="dvd-disc"></div>
                <span>BTTF 2</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd("Back to the Future 3")}
                className="dvd-btn episode-3"
              >
                <div className="dvd-disc"></div>
                <span>BTTF 3</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd("La chèvre")}
                className="dvd-btn other-movie"
              >
                <div className="dvd-disc"></div>
                <span>Autre Film</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !items.trim()}
            className="cyber-submit-btn"
          >
            {loading ? (
              <span className="pulse-text">
                VÉRIFICATION DU CONVOYEUR TEMPOREL...
              </span>
            ) : (
              "CALCULER LE PRIX DU PANIER"
            )}
          </button>
        </form>
      </div>

      <div className="glow-panel receipt-panel">
        <div className="panel-header">
          <span className="dot magenta"></span>
          <h2 className="panel-title">TICKET DE CAISSE DVD</h2>
        </div>

        {loading && (
          <div className="ui-state computing-state">
            <div className="flux-capacitor">
              <div className="flux-line line-1"></div>
              <div className="flux-line line-2"></div>
              <div className="flux-line line-3"></div>
              <div className="flux-core"></div>
            </div>
            <p className="neon-text-orange">
              Génération de la facture en cours...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="ui-state error-state">
            <div className="error-icon">⚠</div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="ui-state placeholder-state">
            <div className="retro-dvd-player">
              <div className="disc-slot"></div>
              <div className="player-display">NO DISC</div>
            </div>
            <p>Le lecteur de panier est vide. Veuillez insérer un film.</p>
          </div>
        )}

        {!loading && result && !error && <Receipt result={result} />}
      </div>
    </div>
  );
}
