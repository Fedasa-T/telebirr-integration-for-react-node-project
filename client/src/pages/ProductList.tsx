import { useState } from "react";
import config from "../config/config";

const priceList = [1.5, 20, 50, 100, 200, 500, 1000];

const ProductList = () => {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const selectProduct = (price: number) => setSelectedPrice(price);

  const startPay = async () => {
    if (!selectedPrice) return;

    try {
      const response = await fetch(`${config.baseUrl}/create/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `diamond_${selectedPrice}`,
          amount: selectedPrice, // No need to stringify
        }),
      });

      const paymentUrl = await response.text();
      if (paymentUrl) {
        window.open(paymentUrl.trim(), "_blank");
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Telebirr Integration</h1>
      <h1 className="text-xl font-bold mb-4">C2B WebCheckout Demo</h1>
      <h2 className="p-2 font-semibold">Amount</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4">
        {priceList.map((price, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              selectedPrice === price
                ? "border-indigo-600 bg-indigo-100"
                : "border-gray-300 hover:border-indigo-400"
            }`}
            onClick={() => selectProduct(price)}
          >
            <div className="flex items-center gap-2">
              <img
                src={`/diamonds_${index + 1}.png`} // Dynamic image selection
                alt={`diamond_${index + 1}`}
                className="w-16 h-16 bg-blue-200"
              />
              <div>
                <p className="font-semibold">diamond_{index + 1}</p>
                <p className="text-gray-600">${price} USD</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={startPay}
        disabled={!selectedPrice}
        className={`mt-6 px-6 py-2 text-white font-bold rounded transition ${
          selectedPrice
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Recharge: {selectedPrice ? `$${selectedPrice} USD` : "Select a product"}
      </button>

      <p className="mt-4 text-sm text-gray-500">www.mobilelegends.com</p>
    </div>
  );
};

export default ProductList;
