"use client"

import { Button, Layout } from 'antd';

import { useRouter } from 'next/navigation';

const { Header } = Layout;

export default function PageHeader ({
  title,
}: { title: string }) {
  const router = useRouter();

  const onClick = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');

    router.push('/login');
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
