# GoQuant Assignment

GoQuant is a application that displays a real-time orderbook with associated market indicators for cryptocurrency trading, specifically for the **BTC-USD** pair.

## Features

1. **Orderbook Display**
   - Displays the real-time orderbook with 10 levels of the best bids and asks for the selected trading pair (e.g., BTC-USD,ETH-USD, XRP-USD).

2. **Spread Indicator**
   - A live graph of the spread indicator, updating every second and rolling over a 1-minute period.

3. **Orderbook Imbalance Indicator**
   - Calculates and displays the orderbook imbalance, representing the buying and selling pressure between bids and asks.

4. **Market Depth Chart**
   - A live line graph representing the market depth of the selected trading pair, updating in real-time.

5. **Responsive Design**
   - The application is fully responsive and adjusts to different screen sizes (desktop, tablet, and mobile).

---

## How to Run the Project Locally

### 1. Install Dependencies

Ensure you have the following installed on your system:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (Check if Node.js and npm are installed by running `node -v` and `npm -v` in the terminal.)

### 2. Clone the Repository

Clone this repository to your local machine using Git:

  ```bash
  git clone <repository-url>
  ```

### 3. Install Required Dependencies
Navigate to the project directory and install the required dependencies:
  ```bash
  cd <project-directory>
  npm install
  ```



### 5. Start the Development Server
To start the development server, run the following command:
```bash
npm run dev
```

## Tech Stack

- **Next.js**: A React framework for building optimized and scalable web applications.
- **TypeScript**: A superset of JavaScript that provides static typing and improves the developer experience.
- **Tailwind CSS**: A utility-first CSS framework for building custom designs quickly.
- **Chart.js**: A JavaScript charting library for creating interactive charts and graphs.
- **Binance API**: Utilized for fetching cryptocurrency market data via RapidAPI.  
  [Binance API]
