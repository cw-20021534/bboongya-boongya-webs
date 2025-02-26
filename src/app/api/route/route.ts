import { NextResponse } from 'next/server';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const start = searchParams.get('start');
 const goal = searchParams.get('goal');

 if (!start || !goal) {
  return NextResponse.json({ error: '출발지와 목적지가 필요합니다.' }, { status: 400 });
 }

 try {
  const response = await fetch(
   `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=trafast`,
   {
    headers: {
     'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
     'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!,
    },
   },
  );

  const data = await response.json();

  console.log(data);

  return NextResponse.json(data);
 } catch (error) {
  console.error('경로 조회 실패:', error);
  return NextResponse.json({ error: '경로 조회에 실패했습니다.' }, { status: 500 });
 }
}
