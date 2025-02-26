'use client';

import { useRef } from 'react';

import type { Place } from '@/types/place';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { styled } from 'styled-components';

interface BottomSheetProps {
 isOpen: boolean;
 onClose: () => void;
 place: Place | null;
}

export function BottomSheet({ isOpen, onClose, place }: BottomSheetProps) {
 const ref = useRef<SheetRef>(null);
 const snapPoints = [-50, 0.5, 200, 0];
 const initialSnap = 1;

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

       <InfoContainer>
        <InfoItem>
         <Navigation className="size-4" />
         <span>{place.distance.toFixed(1)}km</span>
        </InfoItem>
        <InfoItem>
         <Clock className="size-4" />
         <span>{place.estimatedTime}분</span>
        </InfoItem>
       </InfoContainer>

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
