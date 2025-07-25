type OrderbookDisplayProps = {
  bids: [string, string][];
  asks: [string, string][];
};

const getColorForPriceChange = (
  currentPrice: string,
  previousPrice: string,
  isBid: boolean
) => {
  if (isBid) {
    return parseFloat(currentPrice) > parseFloat(previousPrice)
      ? "bg-green-100"
      : "bg-red-100";
  }
  return parseFloat(currentPrice) < parseFloat(previousPrice)
    ? "bg-green-100"
    : "bg-red-100";
};

const OrderbookSection = ({
  title,
  orders,
  getColorForPrice,
}: {
  title: string;
  orders: [string, string][];
  getColorForPrice: (index: number) => string;
}) => (
  <div className="w-full rounded-2xl shadow-lg bg-white border border-gray-200 p-6 transition duration-300 hover:shadow-xl mb-3">
    {/* Header */}
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      {title}
    </h2>

    {/* Column Labels */}
    <div className="flex justify-between px-3 text-gray-500 text-sm font-medium mb-2">
      <span>Price</span>
      <span>Quantity</span>
    </div>

    {/* Order Rows */}
    <ul className="divide-y divide-gray-100">
      {orders?.map((order, index) => (
        <li
          key={index}
          className={`flex justify-between items-center py-2 px-3 font-mono text-sm hover:bg-gray-50 transition-all duration-200 rounded-md ${getColorForPrice(
            index
          )}`}
        >
          <span className="text-gray-800">{order[0]}</span>
          <span className="text-gray-600">{order[1]}</span>
        </li>
      ))}
    </ul>
  </div>
);

function OrderbookDisplay({ bids, asks }: OrderbookDisplayProps) {
  const getColorForBid = (index: number) => {
    return index === 0
      ? "bg-green-100"
      : getColorForPriceChange(bids[index][0], bids[index - 1][0], true);
  };

  const getColorForAsk = (index: number) => {
    return index === 0
      ? "bg-green-100"
      : getColorForPriceChange(asks[index][0], asks[index - 1][0], false);
  };

  return (
    <div className="md:flex md:justify-center items-start gap-8">
      <OrderbookSection
        title="Buy Orders"
        orders={bids}
        getColorForPrice={getColorForBid}
      />
      <OrderbookSection
        title="Sell Orders"
        orders={asks}
        getColorForPrice={getColorForAsk}
      />
    </div>
  );
}

export default OrderbookDisplay;
