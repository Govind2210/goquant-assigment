"use client";
import { useEffect, useState } from "react";
import MarketDepthChart from "@/components/MarketDepthChart";
import SpreadIndicator from "@/components/SpreadIndicator";
import OrderbookDisplay from "@/components/OrderbookDisplay";
import TradingPairSelector from "@/components/TradingPairSelector";

type OrderbookEntry = [string, string];

type OrderbookData = {
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
};

const dummyOrderbookData: OrderbookData = {
  // lastUpdateId: 5018335298,
  bids: [
    ["0.06630900", "6.39500000"],
    ["0.06630800", "10.70410000"],
    ["0.06630600", "12.67180000"],
    ["0.06630500", "1.00000000"],
    ["0.06630400", "0.16000000"],
  ],
  asks: [
    ["0.06631000", "3.61070000"],
    ["0.06631200", "1.17870000"],
    ["0.06631300", "34.50000000"],
    ["0.06631400", "0.05000000"],
    ["0.06631500", "0.32950000"],
  ],
};

const Home = () => {
  const [bids, setBids] = useState<[string, string][]>([]);
  const [asks, setAsks] = useState<[string, string][]>([]);
  const [imbalance, setImbalance] = useState<number>(0);
  const [spreadData, setSpreadData] = useState<number[]>([]);
  const [spreadLabels, setSpreadLabels] = useState<string[]>([]);
  // const [orderbookData, setOrderbookData] = useState<any[] | null>([]);
  const [selectedPair, setSelectedPair] = useState<string>("BTCUSDT");
  const [orderbookHistory, setOrderbookHistory] = useState<any[]>([]);

  // Fetch the orderbook data
  const fetchOrderbookHandler = async () => {
    const url = `https://api.binance.com/api/v3/depth?symbol=${selectedPair}&limit=10`;

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();

      const { bids, asks } = result;

      if (!bids?.length || !asks?.length) {
        throw new Error("Orderbook data is empty or invalid");
      }

      // setOrderbookData({ bids, asks });
      setBids(bids);
      setAsks(asks);
      calculateImbalance(bids, asks);
      updateSpreadData(bids, asks);

      // Maintain only 70 entries
      setOrderbookHistory((prev) => {
        const newData = [{ bids, asks }, ...prev];
        return newData.slice(0, 100);
      });
    } catch (error) {
      console.error("Error fetching orderbook data, using fallback:", error);

      const { bids, asks } = dummyOrderbookData;
      // setOrderbookData(dummyOrderbookData);
      setBids(bids);
      setAsks(asks);
      calculateImbalance(bids, asks);
      updateSpreadData(bids, asks);
    }
  };

  const calculateImbalance = (
    bids: [string, string][],
    asks: [string, string][]
  ) => {
    const totalBuyVolume = bids.reduce(
      (total, bid) => total + parseFloat(bid[1]),
      0
    );
    const totalSellVolume = asks.reduce(
      (total, ask) => total + parseFloat(ask[1]),
      0
    );
    const imbalance =
      (totalBuyVolume - totalSellVolume) / (totalBuyVolume + totalSellVolume);
    setImbalance(imbalance);
  };

  const updateSpreadData = (
    bids: [string, string][],
    asks: [string, string][]
  ) => {
    const bestBid = parseFloat(bids[0][0]);
    const bestAsk = parseFloat(asks[0][0]);
    const spread = bestAsk - bestBid;

    const currentTime = new Date().toLocaleTimeString();

    setSpreadData((prevData) => {
      const newData = [...prevData, spread];
      if (newData.length > 60) newData.shift();
      return newData;
    });

    setSpreadLabels((prevLabels) => {
      const newLabels = [...prevLabels, currentTime];
      if (newLabels.length > 60) newLabels.shift();
      return newLabels;
    });
  };

  // Effect to fetch orderbook data whenever selectedPair changes
  useEffect(() => {
    // Fetch initial data for the selected pair
    fetchOrderbookHandler();

    // Set up interval to fetch data every second
    const intervalId = setInterval(fetchOrderbookHandler, 1000);

    // Clear interval on component unmount or when selectedPair changes
    return () => clearInterval(intervalId);
  }, [selectedPair]); // Re-run effect when selectedPair changes

  return (
    <div className="mx-6 my-2">
      <div className="w-full h-auto flex flex-col-2 justify-between mb-4 align-center mx-3 my-3 ">
        <h2 className=" font-serif font-bold text-blue-700 text-xl mt-2">Order Book - {selectedPair}</h2>
        <TradingPairSelector
          selectedPair={selectedPair}
          setSelectedPair={setSelectedPair}
        />
      </div>

      <div className="mt-2">
        <OrderbookDisplay asks={asks} bids={bids} />
      </div>

      <div className="mt-8">
        <SpreadIndicator spreadLabels={spreadLabels} spreadData={spreadData} />
      </div>

      <div className="w-full rounded-2xl shadow-lg bg-white border border-gray-200 p-6 transition duration-300 hover:shadow-xl my-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-2">
          Orderbook Imbalance Indicator
        </h2>
        <p
          className={`text-3xl font-semibold ${
            imbalance > 0.5 ? "text-green-600" : "text-red-600"
          }`}
        >
          {(imbalance * 100).toFixed(2)}%
        </p>
      </div>

      <div className="my-4 mb-10" >
         <MarketDepthChart orderbookData={orderbookHistory} />
      </div>
    </div>
  );
};

export default Home;
