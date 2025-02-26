'use client';

import { useEffect, useRef } from 'react';

interface RecommendationsMapProps {
 places: { name: string; location: { lat: number; lng: number } }[];
 selectedPlace: { lat: number; lng: number } | null;
}

export default function RecommendationsMap({ places, selectedPlace }: RecommendationsMapProps) {
 const mapRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (mapRef.current) {
   const map = new window.naver.maps.Map(mapRef.current, {
    center: new window.naver.maps.LatLng(places[0]?.location.lat, places[0]?.location.lng),
    zoom: 12,
   });

   // 마커 추가
   const markers = places.map((place) => {
    const marker = new window.naver.maps.Marker({
     position: new window.naver.maps.LatLng(place.location.lat, place.location.lng),
     map: map,
    });

    // 툴팁 추가
    const infoWindow = new window.naver.maps.InfoWindow({
     content: `<div style="padding: 2px; border-radius: 5px; background: rgba(255, 255, 255, 0.9);">
                      <span style="font-size: 10px; background: linear-gradient(to right, #ff7e5f, #feb47b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ${place.name}
                      </span>
                    </div>`,
    });

    // 선택된 장소일 때만 툴팁 표시
    if (selectedPlace?.lat === place.location.lat && selectedPlace?.lng === place.location.lng) {
     infoWindow.open(map, marker.getPosition());
    }

    return marker;
   });

   // 선택된 장소 강조
   if (selectedPlace) {
    map.setCenter(new window.naver.maps.LatLng(selectedPlace.lat, selectedPlace.lng));
   }

   return () => {
    markers.forEach((marker) => marker.setMap(null)); // 컴포넌트 언마운트 시 마커 제거
   };
  }
 }, [places, selectedPlace]);

 return (
  <div className="sticky top-0 z-10 h-72 w-full rounded-lg border">
   <div ref={mapRef} className="h-full w-full" />
  </div>
 );
}
