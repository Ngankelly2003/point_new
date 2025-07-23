import React, { useContext, useEffect, useState } from 'react';
import styles from '@/app/styles/PageLoading.module.scss'
import { Spin } from 'antd/lib';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { AppContext } from '@/context/AppContext';
import { storageGet } from '@/helpers/storage';

type PageLoadingProps = {};

const PageLoading = (props: any) => {
  const { isLoading, setLoading } = useContext(AppContext);
  const [isDark, setIsDark] = useState<boolean>(false);
  if (!isLoading && !props.isLoading) return null;
  
   useEffect(() => {
    setIsDark((storageGet('phoenixTheme') ?? 'light') === 'dark');
  });

  return (
    <div
      className={`${styles.loadingPageWrapper} ${
        isDark ? styles.dark : styles.light
      }`}
    >
      <Spin
        indicator={
          <LoadingOutlined
            className={`${styles.iconLoading}`}
            style={{
              fontSize: 50,
            }}
            spin
          />
        }
      />
    </div>
  );
};

export default PageLoading;
