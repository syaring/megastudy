"use client"

import { useRouter } from 'next/navigation';
import { Button } from 'antd';

export default function Page () {
  const router = useRouter();

  const onClick = () => {
    router.push('/recommend/page1');
  }
  return (
    <div>
      추천서비스 2
      <Button onClick={onClick}>
        이전으로
      </Button>
    </div>
  );
}
