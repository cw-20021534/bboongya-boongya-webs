'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { recommendPlaces } from '@/app/api/actions';
import BikeAnimation from '@/components/bike-animation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, RotateCcw } from 'lucide-react';

const Map = dynamic(() => import('@/components/map'), {
 ssr: false,
 loading: () => <div className="h-72 w-full animate-pulse bg-muted" />,
});

const container = {
 hidden: { opacity: 0 },
 show: {
  opacity: 1,
  transition: {
   duration: 0.3,
   staggerChildren: 0.15,
   ease: 'easeOut',
  },
 },
};

const item = {
 hidden: { opacity: 0, y: 10 },
 show: {
  opacity: 1,
  y: 0,
  transition: {
   duration: 0.5,
   ease: 'easeOut',
  },
 },
};

export default function SettingsPage() {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [duration, setDuration] = useState<number>(60);
 const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
 const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
 const { setPlaces } = useStore();

 // TODO: Groq API 호출 로직
 const handleDurationChange = async ([value]: number[]) => {
  setDuration(value);
  // 나중에 여기에 API 호출 추가
 };

 const handleSubmit = async () => {
  if (!currentLocation) return;

  try {
   setIsLoading(true);
   const result = await recommendPlaces({
    userLocation: currentLocation,
    ridingTime: duration,
    roundTrip: isRoundTrip,
   });

   if (result?.data?.success) {
    // Ensure the data structure includes distance and estimatedTime
    setPlaces(
     result.data.data.map(
      (place: {
       name: string;
       description: string;
       location: { lat: number; lng: number };
       distance: number;
       estimatedTime: number;
      }) => ({
       name: place.name,
       description: place.description,
       location: place.location,
       distance: place.distance,
       estimatedTime: place.estimatedTime,
      }),
     ),
    );
    router.push('/recommendations'); // URL 파라미터 없이 이동
   }
  } catch (error) {
   console.error('추천 요청 중 오류:', error);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <motion.div className="flex min-h-screen flex-col">
   {/* 로딩 오버레이 */}
   {isLoading && (
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm"
    >
     <div className="z-[10000]">
      <BikeAnimation />
     </div>
     <p className="z-[10000] animate-pulse text-lg font-medium text-primary">
      추천 장소를 찾고 있어요...
     </p>
    </motion.div>
   )}

   <motion.header
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="relative flex items-center justify-center gap-4 border-b p-4"
   >
    <Link href="/" className="absolute left-4">
     <Button variant="ghost" size="icon">
      <ArrowLeft className="size-5" />
     </Button>
    </Link>
    <h1 className="animate-gradient bg-300% bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-lg font-semibold text-transparent">
     라이딩 설정
    </h1>
   </motion.header>

   <motion.main
    variants={container}
    initial="hidden"
    animate="show"
    className="flex flex-1 flex-col gap-8 p-4"
   >
    <motion.section variants={item} className="space-y-2">
     <h2 className="flex items-center gap-2 font-medium">
      <MapPin className="size-5 text-primary" />
      출발 위치
     </h2>
     <Map duration={duration} isRoundTrip={isRoundTrip} onLocationChange={setCurrentLocation} />
    </motion.section>

    <motion.section variants={item} className="space-y-4">
     <div className="space-y-2">
      <h2 className="flex items-center gap-2 font-medium">
       <Clock className="size-5 text-primary" />
       라이딩 시간
      </h2>
      <Slider
       value={[duration]}
       onValueChange={handleDurationChange}
       min={10}
       max={300}
       step={10}
      />
      <p className="text-right text-sm text-muted-foreground">{duration}분</p>
     </div>

     <div className="space-y-2">
      <h2 className="flex items-center gap-2 font-medium">
       <RotateCcw className="size-5 text-primary" />
       왕복 여부
      </h2>
      <div className="flex items-center justify-between">
       <motion.span
        key={isRoundTrip ? 'roundtrip' : 'oneway'}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
         type: 'spring',
         stiffness: 300,
         damping: 20,
        }}
       >
        {isRoundTrip ? '왕복' : '편도'}
       </motion.span>
       <Switch checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
      </div>
     </div>
    </motion.section>
   </motion.main>

   <motion.footer
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="border-t p-4"
   >
    <Button
     className="relative w-full"
     size="lg"
     onClick={handleSubmit}
     disabled={isLoading || !currentLocation}
    >
     {isLoading ? (
      <>
       <motion.div
        className="absolute inset-0 bg-primary/10"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2 }}
       />
       <span className="relative">추천 장소 찾는 중...</span>
      </>
     ) : (
      '확인'
     )}
    </Button>
   </motion.footer>
  </motion.div>
 );
}
