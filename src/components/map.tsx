'use client';

import { useEffect, useRef, useState } from 'react';

import { calculateRadius } from '@/app/api/actions';

declare global {
 interface Window {
  naver: typeof naver;
 }
}

interface MapProps {
 duration: number; // 라이딩 시간 (분)
 isRoundTrip: boolean; // 왕복 여부
 onLocationChange: (location: { lat: number; lng: number }) => void;
}

export default function Map({ duration, isRoundTrip, onLocationChange }: MapProps) {
 const mapRef = useRef<HTMLDivElement>(null);
 const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
 const markerRef = useRef<naver.maps.Marker | null>(null);
 const polygonRef = useRef<naver.maps.Polygon | null>(null);
 const mapInstanceRef = useRef<naver.maps.Map | null>(null);

 const createIrregularPolygon = (center: naver.maps.LatLng, radius: number) => {
  const points = 8; // 8각형
  const coordinates: naver.maps.LatLng[] = [];

  for (let i = 0; i < points; i++) {
   const angle = (i / points) * 360;
   // 각 점마다 반지름에 랜덤성을 주어 자연스러운 형태 생성
   const randomFactor = 0.8 + Math.random() * 0.4; // 80~120% 변동
   const rad = (angle * Math.PI) / 180;
   const lat = center.lat() + (radius * Math.cos(rad) * randomFactor) / 111000;
   const lng =
    center.lng() +
    (radius * Math.sin(rad) * randomFactor) / (111000 * Math.cos(center.lat() * (Math.PI / 180)));
   coordinates.push(new window.naver.maps.LatLng(lat, lng));
  }

  // 폐곡선을 만들기 위해 첫 점을 다시 추가
  coordinates.push(coordinates[0]);

  return coordinates;
 };

 const updateArea = async (center: naver.maps.LatLng) => {
  if (!currentLocation || !mapInstanceRef.current) return;

  try {
   const result = await calculateRadius({
    userLocation: {
     lat: center.lat(),
     lng: center.lng(),
    },
    ridingTime: duration,
    roundTrip: isRoundTrip,
   });

   if (result?.data?.success && result.data.data?.radius) {
    // 기존 영역 제거
    if (polygonRef.current) {
     polygonRef.current.setMap(null);
    }

    // 새로운 영역 생성
    const coordinates = createIrregularPolygon(center, result.data.data.radius);
    polygonRef.current = new window.naver.maps.Polygon({
     map: mapInstanceRef.current,
     paths: [coordinates],
     strokeColor: '#5B8FF9',
     strokeOpacity: 0.5,
     strokeWeight: 2,
     fillColor: '#5B8FF9',
     fillOpacity: 0.2,
    });
   }
  } catch (error) {
   console.error('반경 계산 중 오류:', error);
  }
 };

 useEffect(() => {
  const initializeMap = async () => {
   if (!mapRef.current) return;

   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
     (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });

      const mapOptions = {
       center: new window.naver.maps.LatLng(latitude, longitude),
       zoom: 10,
      };

      const map = new window.naver.maps.Map(mapRef.current!, mapOptions);
      mapInstanceRef.current = map;

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
        updateArea(new window.naver.maps.LatLng(position.y, position.x));
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
       updateArea(new window.naver.maps.LatLng(clickedLatLng.y, clickedLatLng.x));
      });

      // 초기 영역 그리기
      updateArea(new window.naver.maps.LatLng(latitude, longitude));
     },
     (error) => {
      console.error('위치 정보를 가져오는데 실패했습니다:', error);
      const defaultLocation = { lat: 37.5666805, lng: 126.9784147 };
      setCurrentLocation(defaultLocation);
     },
    );
   }
  };

  initializeMap();
 }, []);

 // duration이나 isRoundTrip가 변경될 때 영역 업데이트
 useEffect(() => {
  if (currentLocation) {
   const center = new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
   updateArea(center);
  }
 }, [duration, isRoundTrip, currentLocation]);

 // currentLocation 상태가 변경될 때마다 부모 컴포넌트에 알림
 useEffect(() => {
  if (currentLocation) {
   onLocationChange(currentLocation);
  }
 }, [currentLocation, onLocationChange]);

 return (
  <div ref={mapRef} className="relative h-72 w-full rounded-lg border" style={{ zIndex: 0 }} />
 );
}
