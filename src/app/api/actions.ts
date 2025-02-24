'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';

const calculateRadiusSchema = z.object({
 userLocation: z.object({
  lat: z.number(),
  lng: z.number(),
 }),
 ridingTime: z.number().min(10).max(300),
 roundTrip: z.boolean(),
});

export const calculateRadius = actionClient
 .schema(calculateRadiusSchema)
 .action(async ({ parsedInput: { userLocation, ridingTime, roundTrip } }) => {
  try {
   console.log(userLocation, ridingTime, roundTrip);

   // TODO: Groq API 호출 로직 구현
   const avgSpeed = 15; // 평균 시속 15km
   const speedPerMinute = avgSpeed / 60; // 분당 이동 거리 (km)
   const distance = speedPerMinute * ridingTime; // 총 이동 가능 거리
   const radius = roundTrip ? (distance * 1000) / 2 : distance * 1000; // m 단위로 변환

   console.log({ radius, distance });

   return {
    success: true,
    data: {
     radius,
     estimatedDistance: distance,
    },
   };
  } catch (error) {
   console.error('반경 계산 중 오류:', error);
   return {
    success: false,
    error: '반경 계산 중 오류가 발생했습니다.',
   };
  }
 });
