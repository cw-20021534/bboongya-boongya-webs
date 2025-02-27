'use client';

import { useEffect, useRef } from 'react';

interface RecommendationsMapProps {
 places: { name: string; location: { lat: number; lng: number } }[];
 selectedPlace: { lat: number; lng: number } | null;
 currentLocation: { lat: number; lng: number } | null;
 onPlaceSelect: (location: { lat: number; lng: number }) => void;
}

export default function RecommendationsMap({
 places,
 selectedPlace,
 currentLocation,
 onPlaceSelect,
}: RecommendationsMapProps) {
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

    // 마커 클릭 이벤트 추가
    window.naver.maps.Event.addListener(marker, 'click', () => {
     onPlaceSelect(place.location);
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

   // 현재 위치 마커 추가
   if (currentLocation) {
    new window.naver.maps.Marker({
     position: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
     map: map,
     icon: {
      content:
       '<div style="background-color: #2196F3; padding: 5px; border-radius: 50%; border: 2px solid white;"></div>',
     },
    });
   }

   // 선택된 장소 강조
   if (selectedPlace) {
    map.setCenter(new window.naver.maps.LatLng(selectedPlace.lat, selectedPlace.lng));
   }

   return () => {
    markers.forEach((marker) => marker.setMap(null)); // 컴포넌트 언마운트 시 마커 제거
   };
  }
 }, [places, selectedPlace, currentLocation, onPlaceSelect]);

 return (
  <div className="sticky top-0 z-10 h-72 w-full rounded-lg border">
   <div ref={mapRef} className="h-full w-full" />
  </div>
 );
}
