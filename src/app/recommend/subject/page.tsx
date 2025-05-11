"use client"

import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { Button, Layout, Input, Space, Card, Radio, RadioChangeEvent, Divider, Modal } from 'antd';

import { Header, Outline } from '@/component';

import { apiClient } from '@/api/axios';

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
  const [topicId, setTopicId] = useState<string | null>(null);
  const [outline, setOutline] = useState<string>('');

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchPostMedicalTopics = async({
    medicalMaterial,
    subject,
  }: TypeMedicalTopic) => {
    try {
      const response = await apiClient.post<string[]>('/api/v2/medical-topics', {
        medicalMaterial,
        subject,
      });

      return response.data;
    } catch (error) {
      throw error;
    };
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

    const { data } = await fetchPostMedicalTopics({ medicalMaterial, subject });

    setTopicList(data);
  };

  const handleChangeTopic = (e: RadioChangeEvent) => {
    setTopic(e.target.value);
  };

  const fetchPostMedicalTopicsOutline = (
    selectedTopic: string,
    selectedMedicalMaterial: string,
    selectedSubject: string,
  ) => {
    return apiClient.post<{
      topicId: string;
    }>('/api/v2/medical-topics/outline', {
      selectedTopic,
      medicalMaterial: selectedMedicalMaterial,
      subject: selectedSubject,
    })
    .then(function (response) {
      return response.data;
    });
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

  const handleClickSubmit = async () => {
    if (!topic) {
      alert('주제를 선택해주세요.');

      return;
    }

    setButtonLoading(true);

    const { data } = await fetchPostMedicalTopicsOutline(topic, medicalMaterial, subject);

    setTopicId(data.topicId);

    setButtonLoading(false);
  };

  const handleClickSeeOutline = async () => {
    const { data } = await fetchGetMedicalTopicsOutline(topicId!);

    setOutline(data.outline);

    setOpen(true);
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
      <Header title="의학 보고서 생성 예시" />

      <Content
        style={{
          flex: "1 1 auto",
          overflow: "auto",
          padding: "24px",
        }}
      >
        <Space
          direction="vertical"
          size="middle"
          align="center"
          style={{ display: "flex" }}
        >
          <Card title="의학 소재 입력" style={{ width: '100vw' }}>
            <TextArea
              rows={3}
              value={medicalMaterial}
              onChange={handleChangeMedicalMaterial}
            />
          </Card>
          <Card title="과목 소재 입력" style={{ width: '100vw' }}>
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
          <Space direction="vertical" size="middle" style={{ display: 'flex', padding: '0px 20px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              어떤 주제로 생성할까요?
            </div>
            <Radio.Group
              value={topic}
              options={topicList}
              onChange={handleChangeTopic}
              style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            />
            <Button onClick={handleClickSubmit} loading={buttonLoading} type="primary">
              Submit
            </Button>
            {topicId && (
              <Button onClick={handleClickSeeOutline}>
                보고서 확인하기
              </Button>
            )}
          </Space>
        ) : null}
      </Content>

      <Footer
        style={{
          flex: "0 0 auto",
        }}
      />

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
    </Layout>
  );
}
