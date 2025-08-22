"use client";
import dynamic from "next/dynamic";

const ViewerPage = dynamic(() => import("@/app/test/page"), {
  ssr: false, 
});

export default function ThreeJS() {
  return <ViewerPage/>;
}


    // args={[10.5, 10.5]}
          // cellSize={0}
          // cellThickness={0}
          // cellColor="#6f6f6f"
          // sectionSize={5.2}
          // sectionThickness={1.3}
          // sectionColor="#ebe0e0"
          // fadeDistance={5}
          // fadeStrength={0}
          // followCamera={false}
          // infiniteGrid={true}
          // side={THREE.DoubleSide}