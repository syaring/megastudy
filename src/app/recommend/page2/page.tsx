"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Layout, Tag } from 'antd';

import { Header } from '@/component';

const { Content, Footer } = Layout;

export default function Page () {
  const router = useRouter()
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const keywordList = [
    { name: '면역', key: 'immunity' },
    { name: '당뇨병', key: 'diabetes' },
    { name: '암', key: 'cancer' },
    { name: '정신병', key: 'psychosis' },
    { name: '세포', key: 'cell' },
  ];

  const onClickNext = () => {
    const isFullySelected = selectedKeywords.length === 3;

    if (!isFullySelected) {
      alert('내 활동 키워드를 3개 선택해주세요.');

      return;
    }

    router.push('/recommend/page3');
  };

  const onChangeKeywordTag = (key: string, checked: boolean) => {
    // checked
    // true = 선택되지 않은 값이 선택됨
    // false = 선택된 값이 해제됨

    const isFullySelected = selectedKeywords.length === 3;

    if (isFullySelected && checked) {
      // 3개가 이미 선택된 상태에서 추가로 선택하려고 할 경우
      return;
    }

    const nextSelectedKeywords = checked
      ? [...selectedKeywords, key]
      : selectedKeywords.filter((keyword) => keyword !== key);

    setSelectedKeywords(nextSelectedKeywords);
  };

  return (
    <Layout>
      <Header title="주제 추천 시작하기" />

      <Content>
        <div>
          AI 분석으로 학생의 생기부에서 추출한 5가지 활동 키워드입니다. <br />
          이 중 학생이 생각하는 중요 키워드 3가지를 고르세요.
        </div>

        {keywordList.map(({ name, key }) => (
          <Tag.CheckableTag
            key={key}
            checked={selectedKeywords.includes(key)}
            onChange={(checked) => onChangeKeywordTag(key, checked)}
          >
            {name}
          </Tag.CheckableTag>
        ))}
      </Content>

      <Footer>
        <Button onClick={onClickNext} type="primary">
          다음
        </Button>
      </Footer>
    </Layout>
  );
}
