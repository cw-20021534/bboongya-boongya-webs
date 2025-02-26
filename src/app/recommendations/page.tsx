'use client';

import { useState } from 'react';

import Link from 'next/link';

import RecommendationsMap from '@/components/RecommendationsMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Navigation } from 'lucide-react';

export default function RecommendationsPage() {
 const { places } = useStore(); // Zustand 스토어에서 장소 가져오기
 const [selectedPlace, setSelectedPlace] = useState<{ lat: number; lng: number } | null>(null);

 return (
  <motion.div className="flex min-h-screen flex-col">
   <motion.header
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="relative flex h-14 items-center justify-center border-b bg-background/80 backdrop-blur-sm"
   >
    <Link href="/settings" className="absolute left-3">
     <Button variant="ghost" size="icon" className="h-8 w-8">
      <ArrowLeft className="size-4" />
     </Button>
    </Link>
    <h1 className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-base font-semibold text-transparent">
     추천 장소
    </h1>
   </motion.header>

   <motion.main
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="flex flex-1 flex-col gap-4"
   >
    {/* 지도 영역 - 고정 */}
    <div className="sticky top-0 z-10">
     <RecommendationsMap places={places} selectedPlace={selectedPlace} />
    </div>

    {/* 추천 장소 리스트 - 스크롤 영역 */}
    <ScrollArea className="flex-1 p-4">
     <div className="grid grid-cols-1 gap-3 pb-2 md:grid-cols-2">
      <AnimatePresence>
       {places.map((place, index) => (
        <motion.div
         key={place.name}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
         className="min-w-0 p-0.5"
        >
         <Card
          className={`group overflow-hidden bg-gradient-to-br shadow-sm transition-all hover:shadow-md ${
           selectedPlace?.lat === place.location.lat && selectedPlace?.lng === place.location.lng
            ? 'from-primary/10 via-purple-500/5 to-pink-500/10 ring-2 ring-primary'
            : 'hover:bg-accent/5'
          }`}
          onClick={() => setSelectedPlace(place.location)}
         >
          <CardHeader className="space-y-1.5 p-4">
           <CardTitle className="flex items-center gap-2 truncate text-base font-medium">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{place.name}</span>
           </CardTitle>
           <CardDescription className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
             <Navigation className="size-3" />
             {place.distance.toFixed(1)}km
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-secondary-foreground">
             <Clock className="size-3" />
             {place.estimatedTime}분
            </span>
           </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
           <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground"
           >
            {place.description}
           </motion.p>
          </CardContent>
         </Card>
        </motion.div>
       ))}
      </AnimatePresence>
     </div>
    </ScrollArea>
   </motion.main>
  </motion.div>
 );
}
