export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-200 border-t-amber-500 mx-auto" />
        <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
      </div>
    </div>
  );
}
