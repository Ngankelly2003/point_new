import React from 'react';
import styles from './styles/Globals.module.scss';
import LayoutDefault from '@/components/Layout/LayoutPage/page';
import Project from '@/components/Project/page';

function HomePage() {
  return (
    <div className={styles.globalContainer}>
      <LayoutDefault>
          <Project />
      </LayoutDefault>
    </div>
  )
}
export default HomePage
// HomePage.Layout = LayoutDefault;