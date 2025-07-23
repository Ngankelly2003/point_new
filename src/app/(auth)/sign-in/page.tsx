"use client";
import LoginForm from '@/components/LoginForm/page'
import React, { useCallback, useEffect } from 'react'
import styles from '@/app/styles/SignInPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';
import { logoutAuthAction, selectAuth } from '@/store/slices/auth.slice';
import { errorToast, successToast } from '@/helpers/toast';
function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const {  push } = useRouter();
  const { data, isSuccess, isError, errorMessage } = useSelector(selectAuth);

  const handleSuccessLogin = useCallback(async () => {
    if (data) {
     successToast("Sign In Successfully");
      await push('/',)
    } 
  }, [data,  push]);

  // useEffect(() => {
  //   dispatch(logoutAuthAction());
  // }, []);

  useEffect(() => {
    if (isSuccess) {
      handleSuccessLogin();
    }else if(isError) {
      errorToast('Sign In Failed');
    }
  }, [isSuccess,isError]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1 className={`${styles.title} ${styles.fontSize44}`}>{'Sign In'}</h1>
        <LoginForm />
      </div>

    </div>
  )
}

export default SignIn