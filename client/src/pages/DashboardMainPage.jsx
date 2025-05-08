"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all user searches from backend
    const fetchSearches = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/url/getallurlresult"); // Update if your route differs
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearches();
  }, []);

  const filteredResults = results.filter((result) => {
    const matchesSearch = result.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || result.result.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const isNew = (dateStr) => {
    const createdTime = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return now - createdTime <= 10 * 60 * 1000; // 10 minutes
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Phishing Detection Dashboard</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          {["All", "Phishing", "Legitimate"].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === value ? "bg-blue-600 text-white" : "bg-white border border-gray-300"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-600">Loading search results...</p>
      ) : filteredResults.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResults.map((result, index) => {
              const confidenceValue = parseFloat(result.confidence.replace("%", "").replace(" ", ""));
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold break-words">{result.url}</h2>
                    {isNew(result.date) && (
                      <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <span>User: {result.userEmail}</span><br />
                    <span>Date: {formatDate(result.date)}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        result.result.toLowerCase() === "phishing" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      {result.result}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        result.result.toLowerCase() === "phishing" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {result.confidence}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        result.result.toLowerCase() === "phishing" ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${confidenceValue}%` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
