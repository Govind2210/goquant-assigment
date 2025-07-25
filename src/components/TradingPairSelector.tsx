type TradingPairSelectorProps = {
  selectedPair: string;
  setSelectedPair: React.Dispatch<React.SetStateAction<string>>;
};

function TradingPairSelector({
  selectedPair,
  setSelectedPair,
}: TradingPairSelectorProps) {
  return (
    <div className="mx-3">
      <select
        id="pair-select"
        value={selectedPair}
        onChange={(e) => setSelectedPair(e.target.value)}
        className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-800 transition"
      >
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="XRPUSDT">XRP/USDT</option>
      </select>
    </div>
  );
}


export default TradingPairSelector;
