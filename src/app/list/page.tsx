"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button, Layout, Modal, Table, TableProps } from 'antd';
import { useReactToPrint } from 'react-to-print';

import { Header, Outline } from '@/component';

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
  const [outline, setOutline] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    if (window !== undefined) {
      const accessToken = window.localStorage.getItem('access_token');
      const userId = window.localStorage.getItem('user_id');
      const refreshToken = window.localStorage.getItem('refresh_token');
      const username = window.localStorage.getItem('username');

      const isAuthenticated = accessToken && userId && refreshToken && username;

      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, []);

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
    if (!userId) {
      return;
    }

    setTopicList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

  const fetchGetMedicalTopicsOutline = (id: string) => {
    return apiClient.get<{
      outline: string;
    }>(`/api/v2/medical-topics/outline/${id}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
  }

  const handleClickShowOutlineButton = async (topicId: string) => {
    const { data } = await fetchGetMedicalTopicsOutline(topicId);

    setOutline(data.outline);
    setOpen(true);
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
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        cancelText="닫기"
        onOk={() => reactToPrintFn()}
        okText="저장"
        width={1000}
      >
        <div ref={contentRef} style={{ margin: "20px"}}>
          <Outline data={outline} />
        </div>
      </Modal>

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
