'use client';

import { useEffect, useRef, useState } from 'react';

import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from '@/components/ui/accordion';
import type { Place } from '@/types/place';
import { Car, Clock, MapPin, Navigation, RotateCcw } from 'lucide-react';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { styled } from 'styled-components';

interface BottomSheetProps {
 isOpen: boolean;
 onClose: () => void;
 place: Place | null;
 currentLocation?: { lat: number; lng: number };
}

interface RouteInfo {
 distance: number;
 duration: number;
 taxiFare: number;
 tollFare: number;
 fuelPrice: number;
}

interface GuideStep {
 distance: number;
 duration: number;
 instructions: string;
 pointIndex: number;
 type: number;
}

export function BottomSheet({ isOpen, onClose, place, currentLocation }: BottomSheetProps) {
 const ref = useRef<SheetRef>(null);
 const snapPoints = [-50, 0.5, 200, 0];
 const initialSnap = 0;
 const [path, setPath] = useState<naver.maps.LatLng[]>([]);
 const [totalDistance, setTotalDistance] = useState<string>('');
 const [totalTime, setTotalTime] = useState<string>('');
 const mapRef = useRef<HTMLDivElement>(null);
 const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
 const [guideSteps, setGuideSteps] = useState<GuideStep[]>([]);

 useEffect(() => {
  if (!place || !mapRef.current || !currentLocation) return;

  const map = new window.naver.maps.Map(mapRef.current, {
   center: new window.naver.maps.LatLng(place.location.lat, place.location.lng),
   zoom: 13,
  });

  const fetchRoute = async () => {
   try {
    const response = await fetch(
     `/api/route?start=${currentLocation.lng},${currentLocation.lat}&goal=${place.location.lng},${place.location.lat}`,
    );

    const data = await response.json();

    console.log({ data });

    if (data.route) {
     const trafast = data.route.trafast[0];
     const path = trafast.path.map(
      (coords: number[]) => new window.naver.maps.LatLng(coords[1], coords[0]),
     );

     // 경로 그리기
     new window.naver.maps.Polyline({
      map: map,
      path: path,
      strokeColor: '#5B8FF9',
      strokeWeight: 5,
      strokeOpacity: 0.8,
     });

     // 출발지 마커 (현재 위치)
     new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
      map: map,
      icon: {
       content:
        '<div style="background-color: #2196F3; padding: 5px; border-radius: 50%; border: 2px solid white;"></div>',
      },
     });

     // 도착지 마커
     new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(place.location.lat, place.location.lng),
      map: map,
      icon: {
       content:
        '<div style="background-color: #FF5252; padding: 5px; border-radius: 50%; border: 2px solid white;"></div>',
      },
     });

     // 경로 정보 설정
     setTotalDistance((trafast.summary.distance / 1000).toFixed(1));
     setTotalTime(Math.round(trafast.summary.duration / 60000).toString());
     setPath(path);

     // 경로가 모두 보이도록 지도 영역 조정
     const bounds = path.reduce((bounds, latlng) => {
      return bounds.extend(latlng);
     }, new window.naver.maps.LatLngBounds());
     map.fitBounds(bounds);

     // 경로 정보 저장
     setRouteInfo({
      distance: trafast.summary.distance,
      duration: trafast.summary.duration,
      taxiFare: trafast.summary.taxiFare,
      tollFare: trafast.summary.tollFare,
      fuelPrice: trafast.summary.fuelPrice,
     });

     // 가이드 정보 저장
     setGuideSteps(trafast.guide);
    }
   } catch (error) {
    console.error('경로 조회 실패:', error);
   }
  };

  fetchRoute();
 }, [place, currentLocation]);

 // 시간 포맷팅 함수
 const formatDuration = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
   return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
 };

 // 거리 포맷팅 함수
 const formatDistance = (meters: number) => {
  return (meters / 1000).toFixed(1);
 };

 if (!place) return null;

 return (
  <Sheet
   ref={ref}
   isOpen={isOpen}
   onClose={onClose}
   snapPoints={snapPoints}
   initialSnap={initialSnap}
   rootId="root"
  >
   <Sheet.Container>
    <Sheet.Header>
     <div className="mb-4 flex items-center justify-between px-4 pt-4">
      <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
     </div>
    </Sheet.Header>

    <Sheet.Content>
     <Sheet.Scroller draggableAt="both">
      <ContentWrapper>
       <PlaceTitle>
        <MapPin className="size-5 shrink-0 text-primary" />
        {place.name}
       </PlaceTitle>

       <div className="mb-4 h-48 w-full rounded-lg border">
        <div ref={mapRef} className="h-full w-full" />
       </div>

       {routeInfo && (
        <>
         <RouteInfoGrid>
          <RouteInfoCard>
           <Navigation className="size-4" />
           <div>
            <Label>총 거리</Label>
            <Value>{formatDistance(routeInfo.distance)}km</Value>
           </div>
          </RouteInfoCard>

          <RouteInfoCard>
           <Clock className="size-4" />
           <div>
            <Label>예상 시간</Label>
            <Value>{formatDuration(routeInfo.duration)}</Value>
           </div>
          </RouteInfoCard>

          <RouteInfoCard>
           <Car className="size-4" />
           <div>
            <Label>택시 요금</Label>
            <Value>{routeInfo.taxiFare.toLocaleString()}원</Value>
           </div>
          </RouteInfoCard>

          <RouteInfoCard>
           <RotateCcw className="size-4" />
           <div>
            <Label>왕복 거리</Label>
            <Value>{(Number(formatDistance(routeInfo.distance)) * 2).toFixed(1)}km</Value>
           </div>
          </RouteInfoCard>
         </RouteInfoGrid>

         <StyledAccordion type="single" collapsible>
          <AccordionItem value="directions">
           <AccordionTrigger className="text-sm font-medium">상세 경로 안내</AccordionTrigger>
           <AccordionContent>
            <div className="space-y-2 py-2">
             {guideSteps.map((step, index) => (
              <DirectionStep key={index}>
               <StepNumber>{index + 1}</StepNumber>
               <StepContent>
                <StepInstruction>{step.instructions}</StepInstruction>
                <StepDetails>
                 {(step.distance / 1000).toFixed(1)}km ·{Math.round(step.duration / 60000)}분
                </StepDetails>
               </StepContent>
              </DirectionStep>
             ))}
            </div>
           </AccordionContent>
          </AccordionItem>
         </StyledAccordion>

         <AdditionalInfo>
          <InfoRow>
           <span>통행료</span>
           <span>{routeInfo.tollFare.toLocaleString()}원</span>
          </InfoRow>
          <InfoRow>
           <span>연료비</span>
           <span>{routeInfo.fuelPrice.toLocaleString()}원</span>
          </InfoRow>
         </AdditionalInfo>
        </>
       )}

       <Description>{place.description}</Description>
      </ContentWrapper>
     </Sheet.Scroller>
    </Sheet.Content>
   </Sheet.Container>

   <Sheet.Backdrop onTap={onClose} />
  </Sheet>
 );
}

const ContentWrapper = styled.div`
 padding: 0 16px 24px;
`;

const PlaceTitle = styled.h2`
 display: flex;
 align-items: center;
 gap: 8px;
 font-size: 1.5rem;
 font-weight: 600;
 margin-bottom: 16px;
`;

const InfoContainer = styled.div`
 display: flex;
 gap: 16px;
 margin-bottom: 16px;
`;

const InfoItem = styled.div`
 display: flex;
 align-items: center;
 gap: 4px;
 padding: 6px 12px;
 background-color: #f3f4f6;
 border-radius: 20px;
 font-size: 0.875rem;
 color: #4b5563;
`;

const Description = styled.p`
 font-size: 0.875rem;
 line-height: 1.5;
 color: #6b7280;
`;

const RouteInfo = styled.div`
 margin-top: 16px;
 padding: 12px;
 background-color: #f3f4f6;
 border-radius: 8px;
 font-size: 0.875rem;
 color: #4b5563;
 display: flex;
 flex-direction: column;
 gap: 4px;
`;

const RouteInfoGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(2, 1fr);
 gap: 12px;
 margin-bottom: 16px;
`;

const RouteInfoCard = styled.div`
 display: flex;
 align-items: center;
 gap: 12px;
 padding: 12px;
 background-color: #f3f4f6;
 border-radius: 12px;
 color: #4b5563;
`;

const Label = styled.div`
 font-size: 0.75rem;
 color: #6b7280;
`;

const Value = styled.div`
 font-size: 0.875rem;
 font-weight: 600;
 color: #374151;
`;

const AdditionalInfo = styled.div`
 margin-bottom: 16px;
 padding: 12px;
 background-color: #f3f4f6;
 border-radius: 12px;
`;

const InfoRow = styled.div`
 display: flex;
 justify-content: space-between;
 font-size: 0.875rem;
 color: #4b5563;

 &:not(:last-child) {
  margin-bottom: 8px;
 }
`;

const StyledAccordion = styled(Accordion)`
 margin-bottom: 16px;
`;

const DirectionStep = styled.div`
 display: flex;
 gap: 12px;
 padding: 8px;
 border-radius: 8px;
 background-color: #f9fafb;

 &:not(:last-child) {
  margin-bottom: 8px;
 }
`;

const StepNumber = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 width: 24px;
 height: 24px;
 background-color: #e5e7eb;
 border-radius: 50%;
 font-size: 0.75rem;
 font-weight: 600;
 color: #4b5563;
`;

const StepContent = styled.div`
 flex: 1;
`;

const StepInstruction = styled.div`
 font-size: 0.875rem;
 color: #374151;
 margin-bottom: 2px;
`;

const StepDetails = styled.div`
 font-size: 0.75rem;
 color: #6b7280;
`;
