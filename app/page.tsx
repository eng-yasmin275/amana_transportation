'use client';

import { useState } from "react";

import amanaData from "@/lib/amanaData";

import dynamic from "next/dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";


const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

// Dynamically import QRCodeCanvas so it runs only on client
const QRCodeCanvas = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeCanvas),
  { ssr: false }
);

export default function HomePage() {
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);
  const [ticketBought, setTicketBought] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);

  const selectedBus = amanaData.bus_lines.find((b) => b.id === selectedBusId);
  const selectedStop = selectedBus?.bus_stops.find((s) => s.id === selectedStopId);

  const handleBuyTicket = () => {
    if (!selectedBus || !selectedStop) return;
    setTicketBought(true);
  };

  return (
    <main className="flex flex-col min-h-screen p-4">
      {/* Header */}
      <Header />

      {/* Yellow Banner */}
      <div className="bg-yellow-400 text-black text-center py-3 font-semibold mt-2">
        Active Bus Maps
      </div>

      {/* Bus Buttons Above Map */}
      <div className="flex flex-wrap justify-center gap-3 my-4">
        {amanaData.bus_lines.map((bus) => (
          <button
            key={bus.id}
            onClick={() => {
              setSelectedBusId(bus.id);
              setSelectedStopId(null);
              setTicketBought(false);
            }}
            className={`px-4 py-2 rounded-lg border ${
              selectedBusId === bus.id ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
            }`}
          >
            {bus.route_number} - {bus.name}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="w-full h-96 sm:h-[430px] rounded-lg overflow-hidden border border-gray-200">
        <MapView selectedBus={selectedBus} />
      </div>

      {/* Ticket Buy Section */}
      {selectedBus && (
        <div className="flex flex-col items-center mt-4 gap-2">
          <select
            value={selectedStopId ?? ""}
            onChange={(e) => {
              setSelectedStopId(Number(e.target.value));
              setTicketBought(false);
            }}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">Select Stop</option>
            {selectedBus.bus_stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name} ({stop.estimated_arrival})
              </option>
            ))}
          </select>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBuyTicket}
              disabled={!selectedStop}
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              Buy Ticket
            </button>

            {ticketBought && (
              <button
                onClick={() => setShowTicketModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Show Ticket
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && selectedBus && selectedStop && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowTicketModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">{selectedBus.name}</h2>
            <p className="mb-2">
              Stop: {selectedStop.name} <br />
              Arrival: {selectedStop.estimated_arrival}
            </p>
            <QRCodeCanvas
              value={`Bus:${selectedBus.id}-Stop:${selectedStop.id}-Time:${selectedStop.estimated_arrival}`}
              size={200}
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={() => setShowTicketModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Yellow div above bottom buttons */}
      {selectedBus && (
        <div className="bg-yellow-400 text-black text-center py-3 font-semibold mt-4">
          Active Bus Maps
        </div>
      )}

      {/* Mirror Bus Buttons Below Map */}
      <div className="flex flex-wrap justify-center gap-3 my-4">
        {amanaData.bus_lines.map((bus) => (
          <button
            key={`mirror-${bus.id}`}
            onClick={() => {
              setSelectedBusId(bus.id);
              setSelectedStopId(null);
              setTicketBought(false);
            }}
            className={`px-4 py-2 rounded-lg border ${
              selectedBusId === bus.id ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
            }`}
          >
            {bus.route_number} - {bus.name}
          </button>
        ))}
      </div>

      {/* Bus Stops Table */}
      {selectedBus && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Stop</th>
                <th className="px-4 py-2 border">Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {selectedBus.bus_stops.map((stop) => (
                <tr key={stop.id}>
                  <td className="px-4 py-2 border">{stop.name}</td>
                  <td className="px-4 py-2 border">{stop.estimated_arrival}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
