'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
 interface Window {
  naver: typeof naver;
 }
}

export default function Map() {
 const mapRef = useRef<HTMLDivElement>(null);
 const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
 const markerRef = useRef<naver.maps.Marker | null>(null);

 useEffect(() => {
  const initializeMap = async () => {
   if (!mapRef.current) return;

   // 현재 위치 가져오기
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
     (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });

      const mapOptions = {
       center: new window.naver.maps.LatLng(latitude, longitude),
       zoom: 14,
      };

      const map = new window.naver.maps.Map(mapRef.current!, mapOptions);

      // 드래그 가능한 마커 생성
      markerRef.current = new window.naver.maps.Marker({
       position: new window.naver.maps.LatLng(latitude, longitude),
       map,
       draggable: true,
      });

      // 마커 드래그 종료 시 위치 업데이트
      window.naver.maps.Event.addListener(markerRef.current, 'dragend', () => {
       const position = markerRef.current?.getPosition();

       if (position) {
        setCurrentLocation({
         lat: position.y,
         lng: position.x,
        });
       }
      });

      // 지도 클릭 시 마커 이동
      window.naver.maps.Event.addListener(map, 'click', (e: naver.maps.PointerEvent) => {
       const clickedLatLng = e.coord;
       markerRef.current?.setPosition(clickedLatLng);

       setCurrentLocation({
        lat: clickedLatLng.y,
        lng: clickedLatLng.x,
       });
      });
     },
     (error) => {
      console.error('위치 정보를 가져오는데 실패했습니다:', error);
      // 기본 위치 (서울시청)
      const defaultLocation = { lat: 37.5666805, lng: 126.9784147 };
      setCurrentLocation(defaultLocation);
     },
    );
   }
  };

  initializeMap();
 }, []);

 console.log({ currentLocation });

 return <div ref={mapRef} className="h-72 w-full rounded-lg border" />;
}
