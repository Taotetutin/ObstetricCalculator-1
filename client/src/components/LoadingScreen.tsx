import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white">
      <div className="relative w-full h-full">
        <img
          src="/loading.png"
          alt="ObsteriX Legend Loading"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}