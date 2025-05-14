"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button, Layout, Modal, Table, TableProps } from 'antd';
import { useReactToPrint } from 'react-to-print';

import { Header, Outline } from '@/component';

import { apiClient } from '@/api/axios';
import TypeOutline from '@/type/outline';

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
  const [outline, setOutline] = useState<TypeOutline | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setTopicList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchTopicList = async (page: number) => {
    try {
      const response = await apiClient.get<{
        content: {
          topicName: string;
          outlineId: string;
        }[];
        pagination: {
          page: number;
          size: number;
          totalPages: number;
          totalElements: number;
        }
      }>(`/api/v2/users/${userId}/medical-topics/history?size=10&page=${page}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const setTopicList = async (page: number) => {
    const { data } = await fetchTopicList(page);

    setDataSource(data.content.map(({ topicName, outlineId }) => ({
      key: outlineId,
      outlineId,
      topicName,
    })));

    setTotalPages(data.pagination.totalElements);
  }

  const fetchGetMedicalTopicsOutline = (id: string) => {
    return apiClient.get<{
      topics: {
        id: string;
        outline: TypeOutline;
        topic: string;
      }[];
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

    setOutline(data.topics[0].outline);
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
          className={styles.recommendButton}
        >
          주제 추천 시작하기
        </Button>
        <Table
          dataSource={dataSource}
          columns={getColumns(handleClickShowOutlineButton)}
          pagination={{
            position: ['bottomCenter'],
            total: totalPages,
            current: currentPage,
            onChange: (page) => {
              setCurrentPage(page);
              setTopicList(page); // 페이지 변경 시 데이터 가져오기
            },
          }}
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
        {outline && <Outline outline={outline} />}
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
