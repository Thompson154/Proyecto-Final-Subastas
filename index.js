import express from "express";
import cors from "cors";

const app = express();
const PORT = 5010;

app.use(cors());
app.use(express.json());

// Almacenamiento simulado de productos
const products = new Map();

// SSE para actualizaciones de pujas
app.get("/api/bids/:productId", (req, res) => {
  const productId = req.params.productId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Enviar datos iniciales del producto
  const product = products.get(productId);
  if (product) {
    res.write(`event: init\ndata: ${JSON.stringify(product.auction)}\n\n`);
  }

  // Manejar cierre de conexión
  res.on("close", () => {
    // Lógica para manejar cierre de conexión
  });
});

// Endpoint para manejar nuevas pujas
app.post("/api/bid", (req, res) => {
  const { productId, userId, amount, timestamp } = req.body;
  if (!productId || !userId || !amount || !timestamp) {
    return res.status(400).json({ error: "Campos requeridos faltantes" });
  }

  // Actualizar producto con nueva puja
  let product = products.get(productId);
  if (!product) {
    product = {
      id: productId,
      auction: {
        currentPrice: 0,
        bids: [],
        startTime: new Date().toISOString(),
        endTime: "",
        winnerId: null,
      },
      chat: [],
    };
    products.set(productId, product);
  }

  // Validar puja
  if (amount <= product.auction.currentPrice) {
    return res.status(400).json({ error: "La puja debe ser mayor que el precio actual" });
  }

  // Registrar nueva puja
  const newBid = { userId, amount, timestamp };
  product.auction.bids.push(newBid);
  product.auction.currentPrice = amount;
  products.set(productId, product);

  // Enviar notificación de nueva puja a clientes conectados
  // Lógica para enviar notificación a clientes

  res.status(200).json({ sent: true, bid: newBid });
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
