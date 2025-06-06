"use client"

import { useRouter } from 'next/navigation';
import { Button } from 'antd';

import styles from "./page.module.css";

export default function Home () {
  const router = useRouter();

  const onClick = () => {
    router.push('/recommend/page1');
  };

  return (
    <div className={styles.page}>
      추천서비스 시작
      <Button onClick={onClick}>
        추천서비스 시작하기
      </Button>
    </div>
  );
}
