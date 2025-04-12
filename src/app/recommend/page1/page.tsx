"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Dropdown, Layout, Radio, RadioChangeEvent, Select } from 'antd';

import { Header } from '@/component';

const { Content, Footer } = Layout;

import styles from './page1.module.scss';

export default function Page () {
  const router = useRouter();

  const [subject, setSubject] = useState<string | null>(null);
  const [mainEthics, setMainEthics] = useState<string | null>(null);
  const [midEthics, setMidEthics] = useState<string | null>(null);

  const [midEthicsList, setMidEthicsList] = useState<{
    value: string;
    label: JSX.Element;
  }[]>([]);

  const onChangeSubject = (e: RadioChangeEvent) => {
    if (e.target.value === "2") {
      setMainEthics(null);
      setMidEthics(null);
    }

    setSubject(e.target.value);
  };

  const onChangeMainEthics = (value: string) => {
    if (value === mainEthics) {
      return;
    }

    setMainEthics(value);
    setMidEthics(null);
    // midEthics 리스트 받아오기
    setMidEthicsList([
      { value: 'mid1', label: <span>중분류1</span> },
      { value: 'mid2', label: <span>중분류2</span> },
      { value: 'mid3', label: <span>중분류3</span> },
    ]);
  };

  const onChangeMidEthics = (value: string) => {
    setMidEthics(value);
  };

  const onClickCancel = () => {
    router.push('/');
  };

  const onClickStartRecommend = () => {
    if (!mainEthics) {
      alert('윤리 대분류를 선택해주세요.');

      return;
    }

    if (!midEthics) {
      alert('윤리 중분류를 선택해주세요.');

      return;
    }

    // 주제추천 시작
  };

  const onClickNext = () => {
    router.push('/recommend/page2');
  };

  return (
    <Layout>
      <Header title="주제 추천 시작하기" />

      <Content className={styles.content}>
        <div>
          다음 중 학생이 맞춤형 주제 추천을 받고 싶은 분야는?
        </div>
        <Dropdown
          dropdownRender={() => (
            <div>
              윤리 / 심화탐구에 대한 자세한 내용이 나타납니다.
            </div>
          )}
          trigger={['click']}
        >
          윤리 / 심화탐구 자세히 알아보기
        </Dropdown>
        <Radio.Group
          value={subject}
          options={[
            { value: "1", label: "윤리" },
            { value: "2", label: "심화탐구"},
          ]}
          onChange={onChangeSubject}
        />

        {subject === "1" && (
          <div>
            <div>
              다음 중 추천 받고 싶은 윤리 분류를 골라주세요.
            </div>
            <Select
              placeholder="윤리 대분류"
              options={[
                { value: 'main1', label: <span>대분류1</span> },
                { value: 'main2', label: <span>대분류2</span> },
                { value: 'main3', label: <span>대분류3</span> },
              ]}
              value={mainEthics}
              onChange={onChangeMainEthics}
            />
            <Select
              placeholder="윤리 중분류"
              options={midEthicsList}
              value={midEthics}
              onChange={onChangeMidEthics}
              disabled={!mainEthics}
            />
          </div>
        )}
      </Content>

      <Footer>
        {subject === "1" && (
          <>
            <Button onClick={onClickCancel}>
              취소
            </Button>
            <Button onClick={onClickStartRecommend} type="primary">
              AI로 주제 추천 받기
            </Button>
          </>
        )}
        {subject === "2" && ( // 심화탐구 선택시
          <>
            <Button onClick={onClickNext} type="primary">
              다음
            </Button>
          </>
        )}
      </Footer>
    </Layout>
  );
}
