"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
}

const locations: Location[] = [
  {
    id: "chicago",
    name: "Chicago Headquarters",
    address: "401 N Michigan Ave",
    city: "Chicago, IL 60611",
    country: "United States",
    phone: "+1 (312) 555-0100",
    email: "chicago@b360.com",
    hours: "24/7 Operations",
    coordinates: { lat: 41.8881, lng: -87.6298 },
    description: "Our main headquarters and primary operations center",
  },
  {
    id: "london",
    name: "London Office",
    address: "25 Old Broad Street",
    city: "London EC2N 1HN",
    country: "United Kingdom",
    phone: "+44 20 7555 0100",
    email: "london@b360.com",
    hours: "24/7 Operations",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: "European operations and customer support hub",
  },
  {
    id: "singapore",
    name: "Singapore Hub",
    address: "1 Raffles Place",
    city: "Singapore 048616",
    country: "Singapore",
    phone: "+65 6555 0100",
    email: "singapore@b360.com",
    hours: "24/7 Operations",
    coordinates: { lat: 1.2966, lng: 103.8506 },
    description: "Asia-Pacific operations and support center",
  },
  {
    id: "sydney",
    name: "Sydney Office",
    address: "Level 42, 25 Martin Place",
    city: "Sydney NSW 2000",
    country: "Australia",
    phone: "+61 2 9555 0100",
    email: "sydney@b360.com",
    hours: "24/7 Operations",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    description: "Australian and New Zealand support operations",
  },
];

export function LocationsMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simple map placeholder - in production, you would integrate with Google Maps or similar
    setMapLoaded(true);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
          Our Global Locations
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          With strategic hubs across four continents, we provide 24/7 customer support coverage wherever your customers are located.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <Card className="border-2 border-gray-200">
          <CardContent className="p-0">
            <div 
              ref={mapRef}
              className="w-full h-96 bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {/* Placeholder Map with Location Dots */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-indigo-50">
                {/* World Map Outline (simplified) */}
                <svg
                  viewBox="0 0 800 400"
                  className="w-full h-full opacity-20"
                  fill="currentColor"
                >
                  {/* Simplified world map paths */}
                  <path d="M100,200 Q200,150 300,200 T500,200 Q600,180 700,200 L700,300 Q600,280 500,300 T300,300 Q200,320 100,300 Z" />
                  <path d="M150,100 Q250,80 350,100 T550,100 Q650,90 750,100 L750,180 Q650,170 550,180 T350,180 Q250,190 150,180 Z" />
                </svg>
                
                {/* Location Markers */}
                {locations.map((location, index) => (
                  <div
                    key={location.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                      selectedLocation.id === location.id
                        ? "bg-emerald-500 scale-150 shadow-lg"
                        : "bg-indigo-500 hover:scale-125"
                    }`}
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + (index % 2) * 20}%`,
                    }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {location.city}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center z-10">
                <MapPin className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Interactive map showing our global presence
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <div className="space-y-6">
          {/* Location Selector */}
          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-3 rounded-lg text-left transition-all duration-300 ${
                  selectedLocation.id === location.id
                    ? "bg-gradient-emerald-indigo text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm opacity-80">{location.city}</div>
              </button>
            ))}
          </div>

          {/* Selected Location Details */}
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                {selectedLocation.name}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{selectedLocation.address}</div>
                    <div className="text-gray-600">{selectedLocation.city}</div>
                    <div className="text-gray-600">{selectedLocation.country}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <a 
                    href={`tel:${selectedLocation.phone}`}
                    className="text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    {selectedLocation.phone}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <a 
                    href={`mailto:${selectedLocation.email}`}
                    className="text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    {selectedLocation.email}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-900">{selectedLocation.hours}</span>
                </div>

                <div className="pt-2 border-t border-emerald-200">
                  <p className="text-gray-700">{selectedLocation.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
