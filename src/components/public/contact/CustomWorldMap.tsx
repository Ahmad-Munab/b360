"use client";

import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const highlightedCountries = ["Pakistan", "Canada"];

const markers = [
  { markerOffset: -15, name: "Pakistan", coordinates: [69.3451, 30.3753] },
  { markerOffset: 25, name: "Canada", coordinates: [-106.3468, 56.1304] }
];

const CustomWorldMap = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-4 bg-white rounded-lg shadow-md">
      <ComposableMap projectionConfig={{ scale: 150 }} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const isHighlighted = highlightedCountries.includes(geo.properties.NAME);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? "#2E8B57" : "#D6D6DA"}
                  stroke="#FFFFFF"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: isHighlighted ? "#3CB371" : "#A9A9A9", outline: "none" },
                    pressed: { fill: "#2E8B57", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
        {markers.map(({ name, coordinates, markerOffset }) => (
          <Marker key={name} coordinates={coordinates as [number, number]}>
            <circle r={8} fill="#FF5722" stroke="#fff" strokeWidth={2} />
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "14px", fontWeight: "bold" }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default CustomWorldMap;
