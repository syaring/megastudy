"use client"

import { useRouter } from 'next/navigation';
import { Button, Layout, Table } from 'antd';

import styles from './list.module.scss';

const { Content, Footer, Header } = Layout;

export default function Home () {
  const router = useRouter();

  const onClick = () => {
    router.push('/recommend/subject');
  };

  return (
    <Layout>
      <Header style={{ color: "white", fontSize: "20px" }}>
        주제 추천
      </Header>

      <Content className={styles.content}>
        <Table dataSource={dataSource} columns={columns} />
        <Button type="primary" onClick={onClick}>
          주제 추천 시작하기
        </Button>
      </Content>

      <Footer>
        {/* TBU */}
      </Footer>
    </Layout>
  );
}

const dataSource = [
  {
    key: '1',
    date: '2025-03-21 12:00:23',
    reportId: 32,
    subjects: '윤리, 의학기술, 정신질환',
  },
  {
    key: '2',
    date: '2025-03-28 19:30:13',
    reportId: 32,
    subjects: '면역, 임상 분야',
  },
];

const columns = [
  {
    title: '보고서 주제',
    dataIndex: 'subjects',
    key: 'subjects',
  },
  {
    title: '생성일자',
    dataIndex: 'date',
    key: 'date',
  },
];
