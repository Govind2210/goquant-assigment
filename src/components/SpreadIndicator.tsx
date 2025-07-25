import { Line } from "react-chartjs-2";

type SpreadIndicatorProps = {
  spreadLabels: string[];
  spreadData: number[];
};

const SpreadIndicator = ({ spreadLabels, spreadData }: SpreadIndicatorProps) => {
  const isIncreasing =
    spreadData.length > 1 &&
    spreadData[spreadData.length - 1] > spreadData[spreadData.length - 2];

  const spreadChartData = {
    labels: spreadLabels,
    datasets: [
      {
        label: "Spread (USD)",
        data: spreadData,
        borderColor: isIncreasing ? "#16a34a" : "#dc2626",
        backgroundColor: "rgba(0, 0, 0, 0)",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const spreadChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280", // Tailwind gray-500
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          display: true,
          borderDash: [4, 4],
        },
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
    <div className="rounded-2xl shadow-lg bg-white border border-gray-200 p-6 transition duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Spread Indicator
      </h2>
      <div className="h-64 sm:h-80 lg:h-96">
        <Line data={spreadChartData} options={spreadChartOptions} />
      </div>
    </div>
  </div>
  );
};

export default SpreadIndicator;
