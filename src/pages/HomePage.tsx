"use client";
import { useTranslation } from "react-i18next"; 
import { ProductCard } from "../components/ProductCard";
import { WavyBackground } from "../components/ui/wavy-background";
import { useProducts } from "../hooks/productsHook";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { t } = useTranslation();

  const role = useAuthStore((s) => s.user?.role);

  const { products, editProductHandler, deleteProductById } = useProducts();

  // Filter products based on state field
  const activeProducts = products.filter((prod) => prod.state === "active");
  const pastProducts = products.filter((prod) => prod.state === "past");
  const futureProducts = products.filter((prod) => prod.state === "future");

  return (
    <div className="min-h-screen bg-black text-white">
      <WavyBackground className="w-full flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-6 mt-10">
          {t("home.welcome")}
        </h1>
        <p className="text-xl text-gray-400 text-center max-w-2xl">
          {t("home.description")}
        </p>
      </WavyBackground>

      <WavyBackground className="w-full flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
          <section>
            <h2 className="text-3xl font-semibold mb-6">{t("home.activeAuctions")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProducts.length > 0 ? (
                activeProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isAdmin={role === "admin"}
                    onEdit={editProductHandler}
                    onDelete={deleteProductById}
                  />
                ))
              ) : (
                <p className="text-gray-400">{t("home.noActiveAuctions")}</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-10">{t("home.closedAuctions")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastProducts.length > 0 ? (
                pastProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isAdmin={role === "admin"}
                    onEdit={editProductHandler}
                    onDelete={deleteProductById}
                  />
                ))
              ) : (
                <p className="text-gray-400">{t("home.noClosedAuctions")}</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-10">{t("home.futureAuctions")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureProducts.length > 0 ? (
                futureProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isAdmin={role === "admin"}
                    onEdit={editProductHandler}
                    onDelete={deleteProductById}
                  />
                ))
              ) : (
                <p className="text-gray-400">{t("home.noFutureAuctions")}</p>
              )}
            </div>
          </section>
        </div>
      </WavyBackground>
    </div>
  );
};

export default HomePage;  