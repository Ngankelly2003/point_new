"use client";
import dynamic from "next/dynamic";

const ThreeJSPage = dynamic(() => import("@/components/Threejs/page"), {
  ssr: false, // Ngăn chạy server-side để tránh lỗi window, HTMLElement, ...
});

export default function ThreeJS() {
  return <ThreeJSPage />;
}
