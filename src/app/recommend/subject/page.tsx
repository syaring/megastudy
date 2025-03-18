"use client"

// import { useRouter } from 'next/navigation';
import { Button, Layout, Input, Space, Card, Radio, RadioChangeEvent, Divider, CheckboxOptionType } from 'antd';
import { useState } from 'react';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

export default function Page () {
  // const router = useRouter()

  const [subjectList, setSubjectList] = useState<CheckboxOptionType<string>[]>([]);
  const [subject, setSubject] = useState<string | null>(null);

  const onClickCreateSubject = () => {
    // call api
    setSubjectList([
      { value: "1", label: "from api 1" },
      { value: "2", label: "from api 2" },
    ]);
  }

  const onChangeSubject = (e: RadioChangeEvent) => {
    setSubject(e.target.value);
  };

  const onClickSubmit = () => {
    if (!subject) {
      alert('주제를 선택해주세요.');

      return;
    }
    // call api
  }

  return (
    <Layout>
      <Header style={{ color: "white" }}>
        의학 보고서 생성 예시
      </Header>

      <Content>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Card title="의학 소재 입력">
            <TextArea rows={3} />
          </Card>
          <Card title="과목 소재 입력">
            <TextArea rows={3} />
          </Card>

          <Button onClick={onClickCreateSubject}>
            주제 생성
          </Button>
        </Space>

        <Divider />

        {subjectList.length ? (
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            어떤 주제로 생성할까요?
            <Radio.Group
              value={subject}
              options={subjectList}
              onChange={onChangeSubject}
            />
            <Button onClick={onClickSubmit}>
              Submit
            </Button>
          </Space>
        ) : null}
      </Content>

      <Footer>
        {/* TBU */}
      </Footer>
    </Layout>
  );
}
