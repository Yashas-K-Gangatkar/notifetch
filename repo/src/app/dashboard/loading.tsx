export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-pulse" />
        <span className="text-lg font-semibold">Loading dashboard...</span>
      </div>
    </div>
  );
}
