import Hero from "@/components/admin/editAdmin/Hero";
import { getAllUsers } from "@/utils/userGetServerAction";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for better UX
function AdminTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="bg-gray-50 border-b">
            <div className="flex p-3 gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex p-3 gap-4 border-b">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Error boundary component
// function ErrorBoundary({ error }: { error: Error }) {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
//         <p className="text-muted-foreground">
//           Kelola data admin yang terdaftar di sistem
//         </p>
//       </div>
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center py-10 space-y-4">
//             <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-8 h-8 text-red-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Gagal Memuat Data Admin
//               </h3>
//               <p className="text-gray-600 mt-1">
//                 Terjadi kesalahan saat mengambil data admin dari server
//               </p>
//               <details className="mt-2 text-sm text-gray-500">
//                 <summary className="cursor-pointer hover:text-gray-700">
//                   Detail Error
//                 </summary>
//                 <pre className="mt-2 text-left bg-gray-100 p-2 rounded text-xs overflow-auto">
//                   {error.message}
//                 </pre>
//               </details>
//             </div>
//             <button
//               onClick={() => window.location.reload()}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                 />
//               </svg>
//               Coba Lagi
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Admin data wrapper component
async function AdminDataWrapper() {
  try {
    const adminData = await getAllUsers();

    // Handle empty data case
    if (!adminData || adminData.length === 0) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-16 space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Belum Ada Admin Terdaftar
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Mulai dengan menambahkan admin pertama untuk sistem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return <Hero adminData={adminData} />;
  } catch (error) {
    console.error("Error in AdminDataWrapper:", error);
    throw error;
  }
}

export default async function EditAdminPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Edit Admin
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola data admin yang terdaftar di sistem
        </p>
      </div>

      {/* Admin Table with Suspense */}
      <Suspense fallback={<AdminTableSkeleton />}>
        <AdminDataWrapper />
      </Suspense>
    </div>
  );
}
