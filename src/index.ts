import { serve } from "bun";
import index from "./index.html";
import { parseCartInput, calculateCartTotal } from "@/modules/cart";

const server = serve({
  routes: {
    "/*": index,

    "/api/cart/price": {
      async POST(req) {
        try {
          const body = await req.json();
          if (typeof body.items !== "string") {
            return Response.json({ error: "Le champ 'items' doit être une chaîne de caractères" }, { status: 400 });
          }

          const { bttf, otherMovies } = parseCartInput(body.items);
          const price = calculateCartTotal(bttf, otherMovies);
          return Response.json({ price, bttf, otherMovies });
        } catch (err) {
          console.error("Cart price calculation failed:", err);
          return Response.json(
            {
              error: "Requete invalide",
            },
            { status: 400 },
          );
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
