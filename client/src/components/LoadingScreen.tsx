import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="max-w-lg w-full px-4">
        <img
          src="/a-dimly-lit-scene-with-two-doctors-and-a_hkwGmN5yQT6rqriux7-8jQ__SK5iPjDTIWGAz3rz3IASw.png"
          alt="ObsteriX Legend Loading"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}