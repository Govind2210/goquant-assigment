import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

type OrderbookEntry = [string, string];

type OrderbookSnapshot = {
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
};

type MarketDepthChartProps = {
  orderbookData: OrderbookSnapshot[]; // Accepts an array now
};

const MarketDepthChart: React.FC<MarketDepthChartProps> = ({ orderbookData }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!orderbookData || orderbookData.length === 0) return;

    const latestSnapshot = orderbookData[0];

    if (!latestSnapshot?.bids?.length || !latestSnapshot?.asks?.length) return;

    // Sort bids descending, asks ascending
    const sortedBids = [...latestSnapshot.bids].sort(
      (a, b) => parseFloat(b[0]) - parseFloat(a[0])
    );
    const sortedAsks = [...latestSnapshot.asks].sort(
      (a, b) => parseFloat(a[0]) - parseFloat(b[0])
    );

    // Bids processing
    const bidPrices: string[] = [];
    const bidCumulative: number[] = [];
    let totalBids = 0;

    sortedBids.forEach(([price, quantity]) => {
      bidPrices.push(price);
      totalBids += parseFloat(quantity);
      bidCumulative.push(totalBids);
    });

    // Asks processing
    const askPrices: string[] = [];
    const askCumulative: number[] = [];
    let totalAsks = 0;

    sortedAsks.forEach(([price, quantity]) => {
      askPrices.push(price);
      totalAsks += parseFloat(quantity);
      askCumulative.push(totalAsks);
    });

    // Combine for chart
    setChartData({
      labels: [...bidPrices, ...askPrices],
      datasets: [
        {
          label: 'Buy Orders',
          data: [...bidCumulative, ...new Array(askCumulative.length).fill(null)],
          borderColor: 'rgba(34, 197, 94, 0.7)', // Tailwind green-500
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Sell Orders',
          data: [...new Array(bidCumulative.length).fill(null), ...askCumulative],
          borderColor: 'rgba(239, 68, 68, 0.7)', // Tailwind red-500
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
      ],
    });
  }, [orderbookData]);

  return (
    <div className="p-4 bg-white border rounded shadow-md w-full h-[40.125rem] md:h-auto">
      <h2 className="text-xl font-semibold mb-6">Market Depth Chart</h2>
      {chartData ? (
        <div className="h-[300px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Price (USD)',
                  },
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 15,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Cumulative Quantity',
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem: TooltipItem<'line'>) {
                      return `Quantity: ${tooltipItem.raw}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading chart...</p>
      )}
    </div>
  );
};

export default MarketDepthChart;
