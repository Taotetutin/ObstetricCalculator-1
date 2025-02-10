import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white">
      <div className="relative w-full h-full">
        <img
          src="/a-dimly-lit-scene-with-two-doctors-and-a_hkwGmN5yQT6rqriux7-8jQ__SK5iPjDTIWGAz3rz3IASw.png"
          alt="ObsteriX Legend Loading"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}