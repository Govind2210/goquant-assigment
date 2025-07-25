/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  format,
  format as formatDateFns,
  isSameDay,
  startOfWeek,
  subMonths,
} from "date-fns";

interface KlineData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CalendarCellProps {
  klineData: KlineData[];
  selectedPair: string;
}
// Add CalendarView type
type CalendarView = "day" | "week" | "month";

// Add VolatilityLevel type
type VolatilityLevel = "low" | "medium" | "high";

// Add PerformanceDirection type
type PerformanceDirection = "up" | "down" | "neutral";

// Reusable MetricCard component
const MetricCard = ({
  title,
  value,
  variant = "neutral",
  unit = "",
}: {
  title: string;
  value: string | number;
  variant?: "positive" | "negative" | "neutral" | VolatilityLevel;
  unit?: string;
}) => {
  const colorClasses = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-green-600",
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold text-gray-700">{title}</h4>
      <div className={`text-2xl font-bold ${colorClasses[variant]}`}>
        {value} {unit && <span className="text-sm">{unit}</span>}
      </div>
    </div>
  );
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const CalendarCell = ({
  klineData,
  selectedPair,
}: CalendarCellProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Process kline data for calendar display
  const calendarData = useMemo(() => {
    return klineData.map((kline) => {
      const priceChangePct = ((kline.close - kline.open) / kline.open) * 100;
      const volatilityPct = ((kline.high - kline.low) / kline.open) * 100;

      return {
        date: kline.date,
        open: kline.open,
        close: kline.close,
        high: kline.high,
        low: kline.low,
        volume: kline.volume,
        priceChange: priceChangePct,
        volatility: volatilityPct,
        liquidity: kline.volume * kline.close, // Estimated liquidity in quote currency
      };
    });
  }, [klineData]);

  // Navigation functions
  const navigateToPreviousPeriod = () => {
    if (calendarView === "day") setCurrentDate(addDays(currentDate, -1));
    else if (calendarView === "week") setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateToNextPeriod = () => {
    if (calendarView === "day") setCurrentDate(addDays(currentDate, 1));
    else if (calendarView === "week") setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  // Helper functions
  const getVolatilityLevel = (volatility: number): VolatilityLevel => {
    if (volatility < 3) return "low";
    if (volatility < 7) return "medium";
    return "high";
  };

  const getPerformanceDirection = (change: number): PerformanceDirection => {
    if (change > 0.5) return "up";
    if (change < -0.5) return "down";
    return "neutral";
  };

  const renderDayView = () => {
    const dayData = calendarData.find((d) => isSameDay(d.date, currentDate));

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold mb-4">
          {format(currentDate, "EEEE, MMMM d, yyyy")} - {selectedPair}
        </h3>
        {dayData ? (
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Open Price"
              value={dayData.open.toFixed(2)}
              unit="USD"
            />
            <MetricCard
              title="Close Price"
              value={dayData.close.toFixed(2)}
              unit="USD"
            />
            <MetricCard
              title="Volatility"
              value={dayData.volatility.toFixed(2)}
              variant={getVolatilityLevel(dayData.volatility)}
              unit="%"
            />
            <MetricCard
              title="Volume"
              value={dayData.volume.toFixed(2)}
              unit={selectedPair.replace("USDT", "")}
            />
          </div>
        ) : (
          <p>No data available for this day</p>
        )}
      </div>
    );
  };

  function renderWeekView() {
    // Get start and end of the week
    const start = startOfWeek(currentDate);
    const end = addDays(start, 6);

    // Filter calendarData for the current week
    const weekData = calendarData.filter(
      (d) => d.date >= start && d.date <= end
    );

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold mb-4">
          {`Week of ${format(start, "MMM d, yyyy")} - ${format(
            end,
            "MMM d, yyyy"
          )} - ${selectedPair}`}
        </h3>
        {weekData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekData.map((day) => (
              <div
                key={day.date.toISOString()}
                className="bg-white p-3 rounded shadow hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedDay(day.date)}
              >
                <div className="font-semibold mb-2">
                  {format(day.date, "EEE, MMM d")}
                </div>
                <MetricCard
                  title="Open"
                  value={day.open.toFixed(2)}
                  unit="USD"
                />
                <MetricCard
                  title="Close"
                  value={day.close.toFixed(2)}
                  unit="USD"
                  variant={
                    getPerformanceDirection(day.priceChange) === "up"
                      ? "positive"
                      : getPerformanceDirection(day.priceChange) === "down"
                      ? "negative"
                      : "neutral"
                  }
                />
                <MetricCard
                  title="Volatility"
                  value={day.volatility.toFixed(2)}
                  unit="%"
                  variant={getVolatilityLevel(day.volatility)}
                />
                <MetricCard
                  title="Volume"
                  value={day.volume.toFixed(2)}
                  unit={selectedPair.replace("USDT", "")}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No data available for this week</p>
        )}
      </div>
    );
  }

  function format(date: Date, formatStr: string): string {
    return formatDateFns(date, formatStr);
  }

  function renderMonthView(): React.ReactNode {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = startOfWeek(firstDayOfMonth); // Sunday
    const weeks: Date[][] = [];

    const day = new Date(startDay);

    for (let i = 0; i < 6; i++) {
      const week: Date[] = [];
      for (let j = 0; j < 7; j++) {
        week.push(new Date(day));
        day.setDate(day.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">
          {format(currentDate, "MMMM yyyy")} - {selectedPair}
        </h3>
        <div className="grid grid-cols-7 text-center font-semibold mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-2 mb-2">
            {week.map((date, j) => {
              const dayData = calendarData.find((d) => isSameDay(d.date, date));

              const isCurrentMonth = date.getMonth() === month;
              const textColor = isCurrentMonth ? "text-black" : "text-gray-400";
              const bgColor = dayData
                ? {
                    low: "bg-green-100",
                    medium: "bg-yellow-100",
                    high: "bg-red-100",
                  }[getVolatilityLevel(dayData.volatility)]
                : "bg-gray-100";

              return (
                <div
                  key={j}
                  className={`p-2 rounded text-sm ${textColor} ${bgColor} cursor-pointer hover:ring-2`}
                  onClick={() => setSelectedDay(date)}
                >
                  <div className="font-semibold">{date.getDate()}</div>
                  {dayData && (
                    <>
                      <div className="text-xs">
                        {getPerformanceDirection(dayData.priceChange) === "up"
                          ? "🔼"
                          : getPerformanceDirection(dayData.priceChange) ===
                            "down"
                          ? "🔽"
                          : "➖"}{" "}
                        {dayData.priceChange.toFixed(1)}%
                      </div>
                      <div className="text-xs">
                        Vol: {dayData.volume.toFixed(0)}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      {/* Calendar controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={navigateToPreviousPeriod}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &lt;
        </button>
        <h2 className="text-xl font-bold">
          {calendarView === "day" && format(currentDate, "MMMM d, yyyy")}
          {calendarView === "week" &&
            `Week of ${format(startOfWeek(currentDate), "MMM d")}`}
          {calendarView === "month" && format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={navigateToNextPeriod}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &gt;
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        {(["day", "week", "month"] as CalendarView[]).map((view) => (
          <button
            key={view}
            onClick={() => setCalendarView(view)}
            className={`px-4 py-1 rounded ${
              calendarView === view ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {calendarView === "day" && renderDayView()}
      {calendarView === "week" && renderWeekView()}
      {calendarView === "month" && renderMonthView()}
    </div>
  );
};
