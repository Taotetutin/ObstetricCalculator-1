import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <img
          src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
          alt="ObsteriX Legend"
          className="w-48 h-48 mx-auto animate-pulse"
        />
        <h1 className="mt-4 text-2xl font-bold text-blue-700">
          Cargando ObsteriX Legend...
        </h1>
      </div>
    </div>
  );
}