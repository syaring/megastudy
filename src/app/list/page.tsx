"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Layout, Table, TableProps } from 'antd';
import axios from 'axios';

import { DEMO } from '../constants/api';

import styles from './list.module.scss';

const { Content, Footer, Header } = Layout;

const userId = localStorage.getItem('user_id');

type TypeTopicItem = {
  key: string;
  outlineId: string;
  topicName: string;
};

export default function Home () {
  const router = useRouter();

  const [dataSource, setDataSource] = useState<TypeTopicItem[]>([]);

  useEffect(() => {
    axios.get(
      `${DEMO}/api/v2/users/${userId}/medical-topics/history?size=10&page=1'`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(function (response) {
      // TODO: type 정의 필요
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
  }, []);

  const handleClickShowOutlineButton = (topicId: string) => {
    // TODO: v0.0.9 에 없음. authorization 등 체크 필요
    axios.get(
      `${DEMO}/api/v1/ethics/topics/${topicId}/outline`,
      {
        headers: {
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
      <Header style={{ color: "white", fontSize: "20px" }}>
        주제 추천
      </Header>

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
