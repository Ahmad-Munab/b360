"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const EnhancedWorldMap = () => {
  const locations = [
    {
      name: "Canada",
      coordinates: [56.1304, -106.3468] as [number, number],
      color: "#059669", // emerald-600
    },
    {
      name: "Pakistan",
      coordinates: [30.3753, 69.3451] as [number, number],
      color: "#dc2626", // red-600
    },
  ];

  // Custom marker HTML for better styling
  const createCustomIcon = (color: string) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet");
      return L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });
    }
    return null;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
            Our Global Presence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With offices in Canada and Pakistan, we provide 24/7 support
            coverage and local expertise to serve clients worldwide.
          </p>
        </div>

        <Card className="max-w-6xl mx-auto border-2 border-gray-200 shadow-xl">
          <CardContent className="p-0">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              {typeof window !== "undefined" && (
                <MapContainer
                  center={[45, -20]} // Center between Canada and Pakistan
                  zoom={2}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  dragging={true}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {locations.map((location, index) => {
                    const icon = createCustomIcon(location.color);
                    return (
                      <Marker
                        key={index}
                        position={location.coordinates}
                        icon={icon}
                      >
                        <Popup className="custom-popup">
                          <div className="text-center p-2">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {location.name}
                            </h3>
                          
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #f8fafc;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          background: white;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </section>
  );
};

export default EnhancedWorldMap;



