import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-[300px] space-y-6">
        {/* Logo skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-12 rounded-full bg-blue-200/60" />
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto bg-blue-100/60" />
          <Skeleton className="h-4 w-1/2 mx-auto bg-blue-50/60" />
        </div>

        {/* Loading bars */}
        <div className="space-y-2">
          <Skeleton className="h-2 w-full bg-blue-100/60" />
          <Skeleton className="h-2 w-4/5 bg-blue-100/40" />
          <Skeleton className="h-2 w-2/3 bg-blue-100/20" />
        </div>
      </div>
    </div>
  );
}
