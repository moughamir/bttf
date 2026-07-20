import { useState, useMemo, type ChangeEvent } from "react";
import { EXAMPLES } from "@/modules/cart";
import "./CartManager.css";

interface CartPriceResult {
  price: number;
  bttf: Record<string, number>;
  otherMovies: number;
}

export function CartManager() {
  const [items, setItems] = useState("");
  const [result, setResult] = useState<CartPriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const receiptNumber = useMemo(
    () => Math.floor(100000 + Math.random() * 900000),
    [result],
  );

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
        throw new Error("Erreur de calcul.");
      }
      const data = (await res.json()) as CartPriceResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-grid">
      {/* Control panel & Input */}
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

          {/* Quick Add Grid */}
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

      {/* Results Receipt */}
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

        {!loading && result && !error && (
          <div className="dvd-receipt">
            <div className="receipt-banner">
              <h3>CINÉPHILE RETRO STORE</h3>
              <p>2000 temporal road, Hill Valley</p>
              <p className="receipt-ref">
                TICKET: #{receiptNumber}
              </p>
            </div>

            <div className="receipt-dashed-line"></div>

            {/* BTTF Group */}
            {(() => {
              const totalBttf = Object.values(result.bttf).reduce(
                (a, b) => a + b,
                0,
              );
              const distinctBttf = Object.values(result.bttf).filter(
                (q) => q > 0,
              ).length;
              if (totalBttf === 0) return null;

              const discountPct =
                distinctBttf === 3 ? 20 : distinctBttf === 2 ? 10 : 0;
              const baseCost = totalBttf * 15;
              const saved = baseCost * (discountPct / 100);

              return (
                <div className="receipt-group">
                  <h4 className="group-title">
                    SAGA BACK TO THE FUTURE (15.00€/u)
                  </h4>
                  <ul className="receipt-list">
                    {Object.entries(result.bttf).map(([episode, qty]) => {
                      if (qty === 0) return null;
                      return (
                        <li key={episode} className="receipt-list-item">
                          <span>
                            • Back To The Future {episode} (x{qty})
                          </span>
                          <span>{(qty * 15).toFixed(2)} €</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="receipt-sub-row">
                    <span>Sous-total Brut</span>
                    <span>{baseCost.toFixed(2)} €</span>
                  </div>

                  {discountPct > 0 && (
                    <div className="receipt-sub-row discount">
                      <span>Remise Bundle ({discountPct}%)</span>
                      <span>-{saved.toFixed(2)} €</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Other Movies Group */}
            {result.otherMovies > 0 && (
              <div className="receipt-group">
                <h4 className="group-title">
                  AUTRES FILMS HORS SAGA (20.00€/u)
                </h4>
                <div className="receipt-list-item">
                  <span>• DVD Standards (x{result.otherMovies})</span>
                  <span>{(result.otherMovies * 20).toFixed(2)} €</span>
                </div>
              </div>
            )}

            <div className="receipt-dashed-line double"></div>

            <div className="receipt-total-row">
              <span className="total-label">TOTAL À PAYER</span>
              <span className="total-amount">{result.price.toFixed(2)} €</span>
            </div>

            <div className="receipt-footer">
              <p>MERCI DE VOTRE VISITE !</p>
              <p>RETOURNEZ DANS LE FUTUR EN TOUTE SÉCURITÉ</p>
            </div>

            <div className="receipt-barcode">
              <div className="bar small"></div>
              <div className="bar medium"></div>
              <div className="bar large"></div>
              <div className="bar small"></div>
              <div className="bar large"></div>
              <div className="bar medium"></div>
              <div className="bar small"></div>
              <div className="bar large"></div>
              <p className="barcode-numbers">OUTATIME 2000</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
