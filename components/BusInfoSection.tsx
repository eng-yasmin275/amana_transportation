"use client";

import { useState } from "react";
import amanaData from "@/lib/amanaData";

export default function BusInfoSection() {
  // Pull out bus_lines from amanaData
  const buses = amanaData.bus_lines;

  // Track which bus is selected
  const [activeBusId, setActiveBusId] = useState<number | null>(null);

  // Find the selected bus
  const activeBus = buses.find((b) => b.id === activeBusId) || null;

  return (
    <div className="mt-8 space-y-6">
      {/* 1️⃣ Yellow header */}
      <div className="bg-yellow-400 text-black text-center py-4 rounded-md shadow">
        <h2 className="text-xl sm:text-2xl font-bold">Active Bus Maps</h2>
      </div>

      {/* 2️⃣ Bus Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        {buses.map((bus) => (
          <button
            key={bus.id}
            onClick={() => setActiveBusId(bus.id)}
            className={`px-6 py-2 rounded-md font-semibold shadow transition
              ${
                activeBusId === bus.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
          >
            {bus.route_number} – {bus.name}
          </button>
        ))}
      </div>

      {/* 3️⃣ Bus Stops Table */}
      <div className="overflow-x-auto">
        {activeBus ? (
          <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">Stop</th>
                <th className="px-4 py-2 border-b">Next Arrival</th>
                <th className="px-4 py-2 border-b">Next?</th>
              </tr>
            </thead>
            <tbody>
              {activeBus.bus_stops.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{s.name}</td>
                  <td className="px-4 py-2 border-b">{s.estimated_arrival}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {s.is_next_stop ? "✅" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-600 py-6">
            Select a bus to view its stops 🚏
          </div>
        )}
      </div>
    </div>
  );
}
