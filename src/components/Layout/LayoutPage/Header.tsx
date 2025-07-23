"use client";
import React, { useCallback } from 'react'
import styles from '@/app/styles/Header.module.scss';
import { AppstoreAddOutlined, BarChartOutlined, LogoutOutlined, ProfileOutlined, SyncOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Button } from 'antd/lib';
  import { useRouter } from 'next/navigation';
import Image from 'next/image';
  
function Header() {
    const {  push } = useRouter();

    const handleSignOut = useCallback(async () => {
        await push('/sign-out' );
  }, [push]);
    
    
  return (
    <>
    <div className={styles.containerHeader}>
        <div><Image src='/assets/harmony_logo.png' alt ="" width={50} height={50}/></div>
        <div className={styles.containerMenu}>
            <div className={styles.menuItem}>
                <Link href={'/'} className={styles.menuItem}>
                    <div className={styles.iconLarge}><BarChartOutlined /></div>
                    <span>Project</span>
                </Link>
            </div>
            <div className={styles.menuItem}>
                <Link href={'/company'} className={styles.menuItem}>
                    <div className={styles.iconLarge}><AppstoreAddOutlined /></div>
                    <span>Organize</span>
                 </Link>
            </div>
            <div className={styles.menuItem}>
                <Link href="/add-user" target="_blank" className={styles.menuItem}>
                    <div>
                        <Button
                            icon={<UsergroupAddOutlined size={25} />}
                            className={styles.iconLarge}
                        />
                    </div>
                    <span>User</span>            
                </Link>
            </div>
            <div className={styles.menuItem}>
                <div className={styles.iconLarge}><SyncOutlined /></div>
                 <span>In Progress</span>
            </div>
            <div className={styles.menuItem}>
                 <div className={styles.iconLarge}><ProfileOutlined /></div>
                 <span>Profile</span>
            </div>
            <div className={styles.menuItem}>
                <div className={styles.iconLarge}>
                    <Button
                        icon={<LogoutOutlined size={25} />}
                        className={styles.iconLarge}
                        onClick={handleSignOut}
                    />
                </div>
                <span>Logout</span>
        </div>
        </div>
    </div>
    </>
  )
}

export default Header