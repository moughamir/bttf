import { memo, useRef } from "react";
import {
  BTTF_BASE_PRICE,
  MOVIE_STANDARD_PRICE,
  getBttfDiscountInfo,
  type CartPriceResult,
} from "@/modules/cart";

export const Receipt = memo(function Receipt({
  result,
}: {
  result: CartPriceResult;
}) {
  const ticketRef = useRef(Math.floor(100000 + Math.random() * 900000));
  const info = getBttfDiscountInfo(result.bttf);
  const discountPct = Math.round((1 - info.discountRate) * 100);

  return (
    <div className="dvd-receipt">
      <div className="receipt-banner">
        <h3>CINÉPHILE RETRO STORE</h3>
        <p>2000 temporal road, Hill Valley</p>
        <p className="receipt-ref">TICKET: #{ticketRef.current}</p>
      </div>

      <div className="receipt-dashed-line"></div>

      {info.totalQuantity > 0 && (
        <div className="receipt-group">
          <h4 className="group-title">
            SAGA BACK TO THE FUTURE ({BTTF_BASE_PRICE.toFixed(2)}€/u)
          </h4>
          <ul className="receipt-list">
            {Object.entries(result.bttf).map(([episode, qty]) => {
              if (qty === 0) return null;
              return (
                <li key={episode} className="receipt-list-item">
                  <span>
                    • Back To The Future {episode} (x{qty})
                  </span>
                  <span>{(qty * BTTF_BASE_PRICE).toFixed(2)} €</span>
                </li>
              );
            })}
          </ul>

          <div className="receipt-sub-row">
            <span>Sous-total Brut</span>
            <span>{info.baseCost.toFixed(2)} €</span>
          </div>

          {discountPct > 0 && (
            <div className="receipt-sub-row discount">
              <span>Remise Bundle ({discountPct}%)</span>
              <span>-{info.savings.toFixed(2)} €</span>
            </div>
          )}
        </div>
      )}

      {result.otherMovies > 0 && (
        <div className="receipt-group">
          <h4 className="group-title">
            AUTRES FILMS HORS SAGA ({MOVIE_STANDARD_PRICE.toFixed(2)}€/u)
          </h4>
          <div className="receipt-list-item">
            <span>• DVD Standards (x{result.otherMovies})</span>
            <span>
              {(result.otherMovies * MOVIE_STANDARD_PRICE).toFixed(2)} €
            </span>
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
  );
});
