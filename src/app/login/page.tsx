"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { Button, Form, Input } from 'antd';

import { apiClient } from '@/api/axios';

import ERROR_CODE from '@/constants/errorCode';

import styles from './login.module.scss';

type TypePostLoginData = {
  username: string;
  password: string;
}

export default function Login () {
  const router = useRouter();

  const [buttonLoading, setButtonLoading] = useState(false);

  const fetchPostLogin = async ({
    username,
    password,
  }: TypePostLoginData) => {
    try {
      const response = await apiClient.post<{
        access_token: string;
        user_id: string;
        refresh_token: string;
      }>('/api/v2/users/signin', {
        username,
        password,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const onFinish = async (values: TypePostLoginData) => {
    setButtonLoading(true);

    try {
      const { data } = await fetchPostLogin(values);

      if (data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('username', values.username);
        }

        // TODO: 강사 / 학생 권한 구분해서 다르게 routing
        router.push('/list');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.data.code === ERROR_CODE.SIGNIN_FAILED) {
          alert('아이디와 비밀번호를 확인해주세요.');

          return;
        }
      }

      alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Form
        name="login"
        className={styles.form}
        labelCol={{ span: 8}}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="아이디"
          name="username"
          rules={[{ required: true, message: '아이디를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: '패스워드를 입력하세요.' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={buttonLoading}
          >
            로그인
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
