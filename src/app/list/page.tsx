"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button, Layout, Table, TableProps } from 'antd';

import { Header } from '@/component';

import { apiClient } from '@/api/axios';

import styles from './list.module.scss';

const { Content, Footer } = Layout;

type TypeTopicItem = {
  key: string;
  outlineId: string;
  topicName: string;
};

export default function Home () {
  const router = useRouter();

  const [dataSource, setDataSource] = useState<TypeTopicItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = window.localStorage.getItem('user_id');

      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTopicList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTopicList = async () => {
    try {
      const response = await apiClient.get<{
        content: {
          topicName: string;
          outlineId: string;
        }[];
      }>(`/api/v2/users/${userId}/medical-topics/history?size=10&page=1`);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const setTopicList = async () => {
    const { data } = await fetchTopicList();

    setDataSource(data.content.map(({ topicName, outlineId }) => ({
      key: outlineId,
      outlineId,
      topicName,
    })));
  }

  const handleClickShowOutlineButton = async (topicId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/ethics/topics/${topicId}/outline`);

      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const onClick = () => {
    router.push('/recommend/subject');
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header title="주제 추천" />

      <Content
        className={styles.content}
        style={{
          flex: "1 1 auto",
          overflow: "auto",
          padding: "24px",
        }}
      >
        <Button
          type="primary"
          onClick={onClick}
          style={{
            alignSelf: "flex-end",
            marginBottom: "24px",
          }}
        >
          주제 추천 시작하기
        </Button>
        <Table
          dataSource={dataSource}
          columns={getColumns(handleClickShowOutlineButton)}
          pagination={{ position: ['bottomCenter'] }}
        />
      </Content>

      <Footer
        style={{
          flex: "0 0 auto",
        }}
      />
    </Layout>
  );
}

const getColumns = (onClickButton: (topicId: string) => void): TableProps<TypeTopicItem>['columns'] => {
  return [
    {
      title: '보고서 주제',
      dataIndex: 'topicName',
      key: 'topicName',
    },
    {
      title: '다시보기',
      dataIndex: 'outlineId',
      key: 'outlineId',
      render: (value: string) => <Button onClick={() => onClickButton(value)}>보기</Button>
    },
  ]
};
