"use client"

import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input } from 'antd';

import { DEMO } from '../constants/api';

import styles from './login.module.scss';

type TypePostLoginData = {
  username: string;
  password: string;
}

export default function Login () {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAccessToken = window.localStorage.getItem('access_token');

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);

        redirect('/list');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPostLogin = ({
    username,
    password,
  }: TypePostLoginData) => {

    return axios.post(
      `${DEMO}/api/v2/users/signin`,
      {
        username,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
      setButtonLoading(true);
      // TODO: 401 error handling (send user_id)
      // throw Error(error);
    });
  }

  const onFinish = async (values: TypePostLoginData) => {
    setButtonLoading(true);

    const res = await fetchPostLogin(values);

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('user_id', res.user_id);
      localStorage.setItem('refresh_token', res.refresh_token);
      localStorage.setItem('username', values.username);
    }

    setButtonLoading(false);

    // TODO: 강사 / 학생 권한 구분해서 다르게 routing
    router.push('/list');
  };

  return (
    <div className={styles.wrapper}>
      <Form
        name="login"
        className={styles.form}
        labelCol={{ span: 8}}
        wrapperCol={{ span: 16 }}
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
