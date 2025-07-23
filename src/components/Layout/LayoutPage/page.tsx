import React from 'react';
import styles from '@/app/styles/Globals.module.scss';
import Header from './Header';

function LayoutDefault({children}: {children: React.ReactNode}) {
  
  return (
    <div className={styles.globalContainer}>
      <Header/>
      <section className = {styles.globalChildrenLayout}>{children}</section>
    </div>
  )
}

export default LayoutDefault