"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { Button, Layout, Table, TableProps } from 'antd';

import { Header } from '@/component';

import { DEMO } from '../constants/api';

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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = window.localStorage.getItem('user_id');

      if (storedUserId) {
        setUserId(storedUserId);
      }

      const storedAccessToken = window.localStorage.getItem('access_token');

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios.get<{ data: { content: TypeTopicItem[] }}>(
      `${DEMO}/api/v2/users/${userId}/medical-topics/history?size=10&page=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(function (response) {
      setDataSource(response.data.data.content.map(({ topicName, outlineId }) => ({
        key: outlineId,
        outlineId: outlineId,
        topicName: topicName,
      })));
    })
    .catch(function (error) {
      console.error(error);
      // throw Error(error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickShowOutlineButton = (topicId: string) => {
    // TODO: v0.0.9 에 없음. authorization 등 체크 필요
    axios.get(
      `${DEMO}/api/v1/ethics/topics/${topicId}/outline`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.error(error);
      // throw Error(error);
    });
  };

  const onClick = () => {
    router.push('/recommend/subject');
  };

  return (
    <Layout>
      <Header title="주제 추천" />

      <Content className={styles.content}>
        <Table dataSource={dataSource} columns={getColumns(handleClickShowOutlineButton)} />
        <Button type="primary" onClick={onClick}>
          주제 추천 시작하기
        </Button>
      </Content>

      <Footer>
      </Footer>
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
