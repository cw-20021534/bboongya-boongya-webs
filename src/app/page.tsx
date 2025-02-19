'use client';

import Link from 'next/link';

import BikeAnimation from '@/components/bike-animation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
 return (
  <motion.main
   initial="hidden"
   animate="show"
   className="flex min-h-screen flex-col items-center justify-center gap-8 p-4"
  >
   <motion.h1
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
     type: 'spring',
     stiffness: 260,
     damping: 20,
     delay: 0.1,
    }}
    className="animate-gradient bg-300% bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-center text-2xl font-bold text-transparent sm:text-3xl"
   >
    자전거 라이딩 추천 서비스
   </motion.h1>

   <motion.div
    initial={{ rotate: -180, opacity: 0 }}
    animate={{ rotate: 1080, opacity: 1 }}
    transition={{
     duration: 1.2,
     delay: 0.3,
     type: 'spring',
     damping: 15,
     stiffness: 100,
    }}
   >
    <BikeAnimation />
   </motion.div>

   <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="flex flex-col gap-4 text-center text-gray-600 dark:text-gray-300"
   >
    <motion.p initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
     위치, 라이딩 시간, 거리 정보를 입력하면
    </motion.p>
    <motion.p initial={{ x: -50 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
     AI가 최적의 라이딩 장소를 추천해드립니다
    </motion.p>
   </motion.div>

   <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
     type: 'spring',
     stiffness: 200,
     damping: 20,
     delay: 0.8,
    }}
   >
    <Link href="/settings">
     <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4 font-bold text-white">
      시작하기
     </Button>
    </Link>
   </motion.div>
  </motion.main>
 );
}
