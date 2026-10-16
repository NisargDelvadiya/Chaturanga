import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "OptiTour // Finding the Shortest Path",
  description:
    "OptiTour is an interactive Travelling Salesperson Route Visualizer powered by Hill Climbing and 2-Opt local search heuristics. Created by Nisarg Jayesh Delvadiya and Rishan Mazumdar.",
  keywords: [
    "Travelling Salesperson Problem",
    "TSP",
    "Hill Climbing",
    "2-Opt Heuristic",
    "Route Optimization",
    "Artificial Intelligence",
    "Local Search",
    "Graph Theory",
    "Computer Science Mini Project",
    "Nisarg Jayesh Delvadiya",
    "Rishan Mazumdar",
  ],
  authors: [
    { name: "Nisarg Jayesh Delvadiya" },
    { name: "Rishan Mazumdar" },
  ],
  creator: "Nisarg Jayesh Delvadiya & Rishan Mazumdar",
  publisher: "OptiTour",
  applicationName: "OptiTour",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-mono bg-[#080b11] text-zinc-200">
        {children}
      </body>
    </html>
  );
}
