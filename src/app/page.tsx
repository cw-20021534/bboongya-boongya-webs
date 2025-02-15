import Link from 'next/link';

import BikeAnimation from '@/components/bike-animation';
import { Button } from '@/components/ui/button';

export default function Home() {
 return (
  <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
   <h1 className="animate-gradient bg-300% bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-center text-2xl font-bold text-transparent sm:text-3xl">
    자전거 라이딩 추천 서비스
   </h1>

   <BikeAnimation />

   <div className="flex flex-col gap-4 text-center text-gray-600 dark:text-gray-300">
    <p>위치, 라이딩 시간, 거리 정보를 입력하면</p>
    <p>AI가 최적의 라이딩 장소를 추천해드립니다</p>
   </div>

   <Link href="/settings">
    <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4 font-bold text-white">
     시작하기
    </Button>
   </Link>
  </main>
 );
}
