'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, RotateCcw } from 'lucide-react';

const Map = dynamic(() => import('@/components/map'), {
 ssr: false,
 loading: () => <div className="bg-muted h-72 w-full animate-pulse" />,
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
 const [duration, setDuration] = useState<number>(60);
 const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);

 return (
  <motion.div
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="flex min-h-screen flex-col"
  >
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
      <MapPin className="text-primary size-5" />
      출발 위치
     </h2>
     <Map />
    </motion.section>

    <motion.section variants={item} className="space-y-4">
     <div className="space-y-2">
      <h2 className="flex items-center gap-2 font-medium">
       <Clock className="text-primary size-5" />
       라이딩 시간
      </h2>
      <Slider
       value={[duration]}
       onValueChange={([value]) => setDuration(value)}
       min={10}
       max={240}
       step={10}
      />
      <p className="text-muted-foreground text-right text-sm">{duration}분</p>
     </div>

     <div className="space-y-2">
      <h2 className="flex items-center gap-2 font-medium">
       <RotateCcw className="text-primary size-5" />
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
    <Button className="w-full" size="lg">
     확인
    </Button>
   </motion.footer>
  </motion.div>
 );
}
