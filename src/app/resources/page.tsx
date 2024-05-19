"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import Button from '@components/Button';

export default function Resource() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);

        L.marker([latitude, longitude]).addTo(map)
          .bindPopup('You are here')
          .openPopup();

        fetchHospitals(map, latitude, longitude);
      });
    }

    const fetchHospitals = async (map: L.Map, lat: number, lon: number) => {
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:10000,${lat},${lon});
          way["amenity"="hospital"](around:10000,${lat},${lon});
          relation["amenity"="hospital"](around:10000,${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const elements = data.elements;

        elements.forEach((element: any) => {
          if (element.lat && element.lon) {
            L.marker([element.lat, element.lon]).addTo(map)
              .bindPopup(element.tags.name || 'Hospital');
          }
        });
      } catch (error) {
        console.error('Error fetching hospital data:', error);
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <div className="flex flex-grow relative justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Stimulate</h1>
          <p className="mb-6">Check if the person is responsive, can you wake them up?</p>

          <h1 className="text-2xl font-bold mb-4">Airway</h1>
          <p className="mb-6">Make sure there is nothing in the mouth blocking the airway, or stopping the person from breathing. Remove anything that is blocking the airway.</p>

          <h1 className="text-2xl font-bold mb-4">Ventilate</h1>
          <p className="mb-6">Help them breathe. Plug the nose, tilt the head back and give one breath every 5 seconds.</p>

          <h1 className="text-2xl font-bold mb-4">Evaluate</h1>
          <p className="mb-6">Do you see any improvement? Are they breathing on their own? If not, prepare naloxone.</p>

          <h1 className="text-2xl font-bold mb-4">Medicate</h1>
          <p className="mb-6">Inject one dose (1cc) of naloxone into a muscle.</p>

          <h1 className="text-2xl font-bold mb-4">Evaluate and Support</h1>
          <p>Evaluate and support. Is the person breathing? Naloxone usually takes effect in 3-5 minutes. If the person is not awake in 5 minutes, give one more 1cc dose of naloxone.</p>
          <p>It's important to stay with the person until they have woken up or emergency services have arrived. If you need to leave the person alone for any reason, place them into the recovery position before you leave to keep the airway clear and to prevent choking. To place somebody in the recovery position:</p>
          <ul className="list-disc list-inside mb-6">
            <li>Turn them onto their side.</li>
            <li>Place their bottom hand under their head for support.</li>
            <li>Place their top leg at a 90 degree angle to the body.</li>
          </ul>
          <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
          <Button href="/" className="mt-4 bg-black text-black border border-black">Return</Button>
        </div>
      </div>
    </main>
  );
}
