"use client"

import { useRef, useState } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

import { Button, Layout, Input, Space, Card, Radio, RadioChangeEvent, Divider, Modal } from 'antd';

import { Header } from '@/component';
import Outline from './Outline';

import { DEMO } from '../../constants/api';

const { Content, Footer } = Layout;
const { TextArea } = Input;

type TypeMedicalTopic = {
  medicalMaterial: string;
  subject: string;
};

export default function Page () {
  const [medicalMaterial, setMedicalMaterial] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const [topicList, setTopicList] = useState<string[]>([]);
  const [topic, setTopic] = useState<string | null>(null);

  const [outline, setOutline] = useState<string>('');

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchPostMedicalTopics = ({
    medicalMaterial,
    subject,
  }: TypeMedicalTopic): Promise<string[]> => {
    return axios.post(
      `${DEMO}/api/v2/medical-topics`,
      {
        medicalMaterial,
        subject,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      console.error(error);
      // throw Error(error);
    });
  };

  const handleChangeMedicalMaterial = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMedicalMaterial(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSubject(e.target.value);
  };

  const handleClickCreateSubject = async () => {
    if (!medicalMaterial || !subject) {
      alert ('의학 소재, 과목 소재를 입력해 주세요.');

      return;
    }

    const res = await fetchPostMedicalTopics({ medicalMaterial, subject });

    setTopicList(res);
  };

  const handleChangeTopic = (e: RadioChangeEvent) => {
    setTopic(e.target.value);
  };

  const fetchPostMedicalTopicsOutline = (selectedTopic: string) => {
    return axios.post(
      `${DEMO}/api/v2/medical-topics/outline`,
      {
        selectedTopic
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      console.error(error);
      // throw Error(error);
    })
    .finally(function () {
      setButtonLoading(false);
    });
  }

  const handleClickSubmit = async () => {
    if (!topic) {
      alert('주제를 선택해주세요.');

      return;
    }

    setButtonLoading(true);

    const res = await fetchPostMedicalTopicsOutline(topic);

    setOutline(res.outline);
  };

  const handleClickSeeOutline = () => {
    setOpen(true);
  };

  return (
    <Layout>
      <Header title="의학 보고서 생성 예시" />

      <Content>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Card title="의학 소재 입력">
            <TextArea
              rows={3}
              value={medicalMaterial}
              onChange={handleChangeMedicalMaterial}
            />
          </Card>
          <Card title="과목 소재 입력">
            <TextArea
              rows={3}
              value={subject}
              onChange={handleChangeSubject}
            />
          </Card>

          <Button onClick={handleClickCreateSubject}>
            주제 생성
          </Button>
        </Space>

        <Divider />

        {topicList?.length ? (
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            어떤 주제로 생성할까요?
            <Radio.Group
              value={topic}
              options={topicList}
              onChange={handleChangeTopic}
            />
            <Button onClick={handleClickSubmit} loading={buttonLoading}>
              Submit
            </Button>
          </Space>
        ) : null}
      </Content>

      <Footer>
        {outline && <Button onClick={handleClickSeeOutline}>보고서 확인하기</Button>}
      </Footer>

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        cancelText="닫기"
        onOk={() => reactToPrintFn()}
        okText="저장"
        width={1000}
      >
        {outline && <div ref={contentRef}><Outline data={outline} /></div>}
      </Modal>
    </Layout>
  );
}
