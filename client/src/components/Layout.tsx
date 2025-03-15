import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 relative">
        <div className="h-full max-h-screen overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
