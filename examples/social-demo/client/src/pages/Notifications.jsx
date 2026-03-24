export default function Notifications() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
      </div>

      {/* Placeholder */}
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No notifications yet</p>
        <p className="text-sm">When someone likes or comments on your posts, you'll see it here</p>
      </div>
    </div>
  );
}
