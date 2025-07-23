"use client";
import { Button, Form, Input } from 'antd/lib';
import React, { useCallback } from 'react'
import styles from '../../app/styles/SignInPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectAuth } from '@/store/slices/auth.slice';
import { login } from '@/store/actions/auth.action';
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function LoginForm() {
    const dispatch = useDispatch<AppDispatch>();
    const { isFetching, isError, errorMessage } = useSelector(selectAuth);
    const handleSubmitForm = useCallback(
        async (values: any) => {
        // setErrorMsg([]);
        dispatch(login(values));
        console.log("login");
        },
        [dispatch]
    );
    
  return (
    <Form
      name='loginForm'
      initialValues={{ remember: true }}
      onFinish={handleSubmitForm}
      autoComplete='off'
      layout='vertical'
    >
      {/* {renderErrorMsg()} */}
      <Form.Item<FieldType>
        label={<span className={styles.fontSize18}>Username (email address)</span>}
        name='username'
        rules={[
          { required: true, message: 'Please enter your username' },
        ]}
      >
        <Input placeholder={'Username (email address)'} size='large' />
      </Form.Item>

      <Form.Item<FieldType>
        label={<span className={styles.fontSize18}>Password</span>}
        name='password'
        rules={[{ required: true, message:  'Please enter your password' }]}
      >
        <Input.Password placeholder={'Please enter your password'} size='large' />
      </Form.Item>

      <Form.Item
        style={{ width: '100%', textAlign: 'center' }}
        className={`${styles.center}`}
      >
        <Button
          type='primary'
          className={`${styles.fontSize18} ${styles.center} ${styles.signinBtn}`}
          htmlType='submit'
          size='large'
          loading={isFetching}
        >
          {'Sign In'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm