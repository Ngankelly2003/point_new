"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "@/app/styles/Header.module.scss";
import {
  AppstoreAddOutlined,
  BarChartOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SyncOutlined,
  UsergroupAddOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Drawer } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

function Header() {
  const { push } = useRouter();
  const pathname = usePathname();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    roles: string[];
  }>({
    fullName: "",
    roles: [],
  });

  useEffect(() => {
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userStr ? JSON.parse(userStr) : null;

    if (user) {
      setUserInfo({
        fullName: user.fullName || "",
        roles: user.roles || [],
      });
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await push("/sign-out");
  }, [push]);

  const toggleDrawer = () => {
    setDrawerVisible((prev) => !prev);
  };

  const isActive = (path: string) => pathname === path;

  const isNormalUser = userInfo.roles.includes("normal");

  return (
    <>
      <div className={styles.containerHeader}>
        <div>
          <Link href="/" className={styles.logo}>
            <Image
              src="/assets/harmony_logo.png"
              alt="logo"
              width={50}
              height={50}
            />
          </Link>
        </div>

        {/* Menu desktop */}
        <div className={styles.containerMenu}>
          <Link
            href="/"
            className={`${styles.menuItem} ${
              isActive("/") ? styles.active : ""
            }`}
          >
            <div>
              <BarChartOutlined className={styles.iconLarge} />
            </div>
            <span>Project</span>
          </Link>

          {!isNormalUser && (
            <>
              <Link
                href="/company"
                className={`${styles.menuItem} ${
                  isActive("/company") ? styles.active : ""
                }`}
              >
                <div>
                  <AppstoreAddOutlined className={styles.iconLarge} />
                </div>
                <span>Organize</span>
              </Link>

              <Link
                href="/add-user"
                target="_blank"
                className={`${styles.menuItem} ${
                  isActive("/add-user") ? styles.active : ""
                }`}
              >
                <div>
                  <UsergroupAddOutlined className={styles.iconLarge} />
                </div>
                <span>User</span>
              </Link>

              {/* <div className={styles.menuItem}>
                <div>
                  <SyncOutlined className={styles.iconLarge} />
                </div>
                <span>In Progress</span>
              </div> */}
            </>
          )}

          <div className={styles.menuItem}>
            <div>
              <ProfileOutlined className={styles.iconLarge} />
            </div>
            <span>Profile</span>
          </div>
          <div className={styles.menuItem}>
            <span style={{ marginTop: 20, fontWeight: "bold" }}>
              {userInfo.fullName}
            </span>
          </div>
          <div
            className={`${styles.menuItem} ${
              isActive("/sign-out") ? styles.active : ""
            }`}
            onClick={handleSignOut}
            style={{ cursor: "pointer" }}
          >
            <div>
              <LogoutOutlined className={styles.iconLarge} />
            </div>
            <span>Logout</span>
          </div>
        </div>

        {/* Menu mobile icon */}
        <div className={styles.mobileMenuIcon} onClick={toggleDrawer}>
          <MenuOutlined />
        </div>
      </div>

      {/* Drawer menu mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={toggleDrawer}
        open={drawerVisible}
      >
        <div
          className={`${styles.drawerItem} ${
            isActive("/") ? styles.activeDrawer : ""
          }`}
        >
          <BarChartOutlined />
          <Link href="/">Project</Link>
        </div>

        {!isNormalUser && (
          <>
            <div
              className={`${styles.drawerItem} ${
                isActive("/company") ? styles.activeDrawer : ""
              }`}
            >
              <AppstoreAddOutlined />
              <Link href="/company">Organize</Link>
            </div>

            <div
              className={`${styles.drawerItem} ${
                isActive("/add-user") ? styles.activeDrawer : ""
              }`}
            >
              <UsergroupAddOutlined />
              <Link href="/add-user" target="_blank">
                User
              </Link>
            </div>
            {/* 
            <div className={styles.drawerItem}>
              <SyncOutlined />
              <span>In Progress</span>
            </div> */}
          </>
        )}

        <div className={styles.drawerItem}>
          <ProfileOutlined />
          <span>Profile</span>
        </div>

        <div
          className={styles.drawerItem}
          onClick={handleSignOut}
          style={{ cursor: "pointer" }}
        >
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      </Drawer>
    </>
  );
}

export default Header;
