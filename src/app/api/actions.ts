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
   const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
     model: 'llama-3.1-8b-instant', // 모델 변경
     messages: [
      {
       role: 'system',
       content: `자전거 라이딩 거리 계산기입니다. 이동 가능한 거리를 계산하세요:
              - 평균 속도: 15km/h (초보자 기준)
              - 날씨, 지형, 신호등 등의 감속 요소 고려
              - 실제 이동 거리는 직선 거리의 약 1.2배로 계산
              - 응답은 반드시 JSON 형식으로 반환하세요:
              {
                "distance": number, // km 단위 이동 가능 거리
                "estimatedTime": number, // 예상 이동 시간 (분)
                "averageSpeed": number, // 평균 속도 (km/h)
                "difficulty": "쉬움" | "보통" | "어려움" // 난이도
              }`,
      },
      {
       role: 'user',
       content: `
              현재 위치: (${userLocation.lat}, ${userLocation.lng})
              라이딩 시간: ${ridingTime}분
              이동 방식: ${roundTrip ? '왕복' : '편도'}
              
              위 조건을 반영해 JSON 형식으로 이동 가능 거리와 관련 정보를 반환해주세요.`,
      },
     ],
     max_tokens: 100,
     temperature: 0.2, // 더 예측 가능한 응답을 위해 낮춤
     top_p: 0.8, // 안정적인 응답을 위해 조정
     response_format: { type: 'json_object' },
    }),
   });

   if (!response.ok) {
    throw new Error('Groq API 호출 실패');
   }

   const data = await response.json();

   const result = JSON.parse(data.choices[0]?.message?.content || '{}');

   if (!result.distance) {
    throw new Error('거리 계산 실패');
   }

   const radius = roundTrip ? result.distance * 1000 : (result.distance * 1000) / 2; // m 단위로 변환

   return {
    success: true,
    data: {
     radius,
     estimatedDistance: result.distance,
     estimatedTime: result.estimatedTime,
     averageSpeed: result.averageSpeed,
     difficulty: result.difficulty,
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

const recommendPlacesSchema = z.object({
 userLocation: z.object({
  lat: z.number(),
  lng: z.number(),
 }),
 ridingTime: z.number().min(10).max(300),
 roundTrip: z.boolean(),
});

export const recommendPlaces = actionClient
 .schema(recommendPlacesSchema)
 .action(async ({ parsedInput: { userLocation, ridingTime, roundTrip } }) => {
  try {
   const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
     model: 'llama-3.1-8b-instant',
     messages: [
      {
       role: 'system',
       content: `자전거 라이딩 장소 추천 시스템입니다. 다음 조건을 고려하여 최대 5곳의 장소를 추천해주세요:
        - 주어진 위치에서 자전거로 이동 가능한 거리
        - 라이딩 시간과 왕복 여부 고려
        - 실제 존재하는 장소만 추천
        - 응답은 반드시 다음 JSON 형식으로 반환:
        {
          "places": [
            {
              "name": string, // 장소명
              "description": string, // 추천 이유
              "location": { lat: number, lng: number }, // 좌표
              "distance": number, // 출발지로부터의 거리 (km)
              "estimatedTime": number // 예상 이동 시간 (분)
            }
          ]
        }`,
      },
      {
       role: 'user',
       content: `
        - 현재 위치: (위도 ${userLocation.lat}, 경도 ${userLocation.lng})
        - 라이딩 시간: ${ridingTime}분
        - 이동 방식: ${roundTrip ? '왕복' : '편도'}
        
        위 조건을 반영해 추천 장소 목록을 JSON 형식으로 반환해주세요.`,
      },
     ],
     max_tokens: 1000,
     temperature: 0.7,
     top_p: 0.9,
     response_format: { type: 'json_object' },
    }),
   });

   if (!response.ok) {
    throw new Error('Groq API 호출 실패');
   }

   const data = await response.json();
   const result = JSON.parse(data.choices[0]?.message?.content || '{}');

   if (!result.places?.length) {
    throw new Error('장소 추천 실패');
   }

   return {
    success: true,
    data: result.places,
   };
  } catch (error) {
   console.error('장소 추천 중 오류:', error);
   return {
    success: false,
    error: '장소 추천 중 오류가 발생했습니다.',
   };
  }
 });
