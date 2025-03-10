'use client';

import dynamic from 'next/dynamic';

import bikeAnimation from '@/assets/animations/bike-animation.json';

const Lottie = dynamic(() => import('lottie-react'), {
 ssr: false,
 loading: () => <div className="bg-muted h-72 w-full animate-pulse" />,
});

export default function BikeAnimation() {
 return (
  <div className="w-64 sm:w-72">
   <Lottie animationData={bikeAnimation} loop={true} />
  </div>
 );
}
