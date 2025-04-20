"use client"

import { Button, Layout } from 'antd';

import { useRouter } from 'next/navigation';

const { Header } = Layout;

export default function PageHeader ({
  title,
}: { title: string }) {
  const router = useRouter();

  const onClick = () => {
    try {
      if (window !== undefined) {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('user_id');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('username');

        router.push('/login');
      }
    } catch {
      alert ('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  return (
    <Header style={{ color: "white", fontSize: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {title}
      <Button type="primary" onClick={onClick}>
        로그아웃
      </Button>
    </Header>
  );
}
