"use client"
import React from 'react';
import { Button, Form, Input } from 'antd';

import styles from './login.module.scss';

export default function Login () {
  const onFinish = (values:
    { userId: string; password: string; }
  ) => {
    console.log(values);
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
          name="userId"
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
          <Button type="primary" htmlType="submit">
            로그인
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
