export function SkeletonProductCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-3 animate-pulse">
      <div className="aspect-[3/4] w-full rounded-lg bg-gray-200"></div>
      <div className="flex flex-col gap-2 px-1 mt-2">
        <div className="h-3 w-1/3 rounded-full bg-gray-200"></div>
        <div className="h-4 w-3/4 rounded-full bg-gray-200"></div>
        <div className="h-4 w-1/4 rounded-full bg-gray-200 mt-1"></div>
      </div>
    </div>
  );
}
