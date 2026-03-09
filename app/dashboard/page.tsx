import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Flowly</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user?.name}</span>

          <a
            href="/api/auth/signout"
            className="text-sm text-gray-500
            hover:text-gray-900
            transition-colors"
          >
            Signout
          </a>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Hey {session.user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-gray-500">What do you need to get done today?</p>
      </div>
    </main>
  );
}
