import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductCard3dComponent } from "../components/ProductCard3d";
import { useProducts } from "../hooks/productsHook";
import { useAuthStore } from "../store/useAuthStore";
import { WavyBackground } from "../components/ui/wavy-background";

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    selectedProduct,
    error,
    fetchProduct,
    handleBid,
    updateProduct,
  } = useProducts();
  const currentUser = useAuthStore((s) => s.user);
  const [bidAmount, setBidAmount] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }

    if (!productId) return;
    const eventSource = new EventSource(`http://localhost:3001/events`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.tipo === "nueva_puja" && data.puja.productId === productId && selectedProduct) {
          updateProduct({
            ...selectedProduct,
            auction: {
              ...selectedProduct.auction,
              currentPrice: data.puja.amount,
              bids: [
                ...selectedProduct.auction.bids,
                {
                  userId: data.puja.userId,
                  username: data.puja.username,
                  amount: data.puja.amount,
                  timestamp: data.puja.timestamp,
                },
              ],
            },
          });
        }
      } catch (err) {
        console.error("Error parsing SSE event:", err);
      }
    };
    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
      setTimeout(() => {
        if (productId) {
          fetchProduct(productId); // Refresh product data
        }
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [productId, fetchProduct, selectedProduct, updateProduct]);

  useEffect(() => {
    if (!selectedProduct) return;

    const calculateDurationInSeconds = (duration: {
      years: number;
      months: number;
      weeks: number;
      hours: number;
    }) => {
      return (
        duration.years * 31536000 +
        duration.months * 2592000 +
        duration.weeks * 604800 +
        duration.hours * 3600
      );
    };

    const formatTime = (seconds: number) => {
      if (seconds <= 0) return "00:00:00";
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${days ? days + "d " : ""}${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    let interval: ReturnType<typeof setInterval> | null = null;

    if (
      selectedProduct.state === "active" &&
      selectedProduct.auction.startTime
    ) {
      const durationSeconds = calculateDurationInSeconds(
        selectedProduct.duration
      );
      const startTime = new Date(selectedProduct.auction.startTime).getTime();
      const endTime = startTime + durationSeconds * 1000;
      interval = setInterval(() => {
        const now = new Date().getTime();
        const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
        setRemainingTime(
          secondsLeft > 0 ? formatTime(secondsLeft) : "Subasta finalizada"
        );
        if (secondsLeft <= 0) {
          clearInterval(interval!);
        }
      }, 1000);
    } else if (
      selectedProduct.state === "future" &&
      selectedProduct.auction.startTime
    ) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const startTime = new Date(selectedProduct.auction.startTime).getTime();
        const secondsLeft = Math.max(0, Math.floor((startTime - now) / 1000));
        setRemainingTime(
          secondsLeft > 0 ? formatTime(secondsLeft) : "Subasta iniciada"
        );
        if (secondsLeft <= 0) {
          clearInterval(interval!);
        }
      }, 1000);
    } else if (selectedProduct.state === "past") {
      setRemainingTime("Subasta finalizada");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedProduct]);

  const handlePlaceBid = async () => {
    if (!currentUser) {
      alert("Por favor, inicia sesión para pujar.");
      return;
    }
    if (
      !selectedProduct ||
      bidAmount <= selectedProduct.auction.currentPrice
    ) {
      alert("La puja debe ser mayor que el precio actual.");
      return;
    }
    try {
      await handleBid(currentUser.id, currentUser.username, selectedProduct.id, bidAmount);
      setBidAmount(0);
    } catch (err) {
      alert("Error al realizar la puja. Inténtalo de nuevo.");
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      alert("Por favor, inicia sesión para enviar un mensaje.");
      return;
    }
    if (!chatMessage.trim()) {
      alert("El mensaje no puede estar vacío.");
      return;
    }
    if (!selectedProduct) {
      alert("Producto no encontrado.");
      return;
    }
    try {
      const newMessage = {
        userId: currentUser.id,
        message: chatMessage,
        username: currentUser.username,
        timestamp: new Date().toISOString(),
      };
      const updatedProduct = {
        ...selectedProduct,
        chat: [...selectedProduct.chat, newMessage],
      };
      await updateProduct(updatedProduct as any);
      setChatMessage("");
    } catch (err) {
      alert("Error al enviar el mensaje. Inténtalo de nuevo.");
    }
  };

  // Find the winner (highest bid) when auction is past
  const winner = selectedProduct?.state === "past" && selectedProduct?.auction.bids.length > 0
    ? selectedProduct.auction.bids.reduce((prev, curr) =>
        prev.amount > curr.amount ? prev : curr
      )
    : null;

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center cardContainer-main">
        <p>Error: {error || "Producto no encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white cardContainer-main">
      <WavyBackground className="w-full flex flex-col items-center justify-center z-0">
        <h1 className="text-5xl font-bold mb-6 mt-10">
          ¡Bienvenido a la subasta {selectedProduct.title}!
        </h1>
        <p className="text-xl text-gray-400 text-center max-w-2xl">
          Tu portal premium de subastas en vivo y productos exclusivos.
        </p>
      </WavyBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 cardContainer relative">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Product Image and Details */}
          <div className="flex-1 cardContainer-grid">
            <ProductCard3dComponent
              img={selectedProduct.image || "https://via.placeholder.com/400"}
            />
            <div className="mt-6 cardContainer-info">
              <h1 className="text-3xl font-semibold text-white">
                {selectedProduct.title}
              </h1>
              <p className="mt-2 text-lg text-gray-400">
                {selectedProduct.description}
              </p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-300">
                  Precio actual: €{selectedProduct.auction.currentPrice}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Precio base: €{selectedProduct.basePrice}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-400">
                  Estado:{" "}
                  {selectedProduct.state === "active"
                    ? "Activa"
                    : selectedProduct.state === "past"
                    ? "Finalizada"
                    : "Futura"}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-400">
                  Duración:{" "}
                  {selectedProduct.duration.years
                    ? `${selectedProduct.duration.years} años `
                    : ""}
                  {selectedProduct.duration.months
                    ? `${selectedProduct.duration.months} meses `
                    : ""}
                  {selectedProduct.duration.weeks
                    ? `${selectedProduct.duration.weeks} semanas `
                    : ""}
                  {selectedProduct.duration.hours
                    ? `${selectedProduct.duration.hours} horas`
                    : ""}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-400">
                  Tiempo restante: {remainingTime}
                </span>
              </div>
              {selectedProduct.state === "past" && winner && (
                <div className="mt-4">
                  <span className="text-lg font-medium text-green-400">
                    Ganador: {winner.username} con €{winner.amount}
                  </span>
                </div>
              )}
              {selectedProduct.state === "active" && (
                <div className="mt-4">
                  <label
                    htmlFor="bid"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Tu puja (€)
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      id="bid"
                      type="number"
                      value={bidAmount}
                      onChange={(e) =>
                        setBidAmount(Math.max(0, parseInt(e.target.value)))
                      }
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      min={selectedProduct.auction.currentPrice + 1}
                      step="1"
                    />
                    <button
                      onClick={handlePlaceBid}
                      className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={
                        !bidAmount ||
                        bidAmount <= selectedProduct.auction.currentPrice
                      }
                    >
                      Pujar
                    </button>
                  </div>
                </div>
              )}
              {selectedProduct.auction.bids.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-300">
                    Historial de pujas
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {selectedProduct.auction.bids.map((bid, index) => (
                      <li key={index} className="text-sm text-gray-400">
                        Puja de €{bid.amount} por usuario {bid.username} (
                        {new Date(bid.timestamp).toLocaleString()})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 lg:mt-0 lg:w-1/3 cardContainer-chat">
            <h3 className="text-lg font-medium text-gray-300 mb-4 mt-16">
              Chat en vivo
            </h3>
            <div className="bg-white/10 dark:bg-zinc-800/50 rounded-md p-4 h-64 overflow-y-auto">
              {selectedProduct.chat.length > 0 ? (
                selectedProduct.chat.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">{msg.username}</span>:{" "}
                      {msg.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No hay mensajes aún.</p>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="chat"
                className="block text-sm font-medium text-gray-400"
              >
                Enviar mensaje
              </label>
              <div className="flex items-center mt-1">
                <input
                  id="chat"
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Escribe tu mensaje..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!chatMessage.trim()}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;