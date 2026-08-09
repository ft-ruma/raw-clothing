import { prisma } from "@/lib/prisma";
import { Mail, Download } from "lucide-react";
import NewsletterExport from "@/components/admin/NewsletterExport";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
          <p className="mt-2 text-sm text-gray-700">
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NewsletterExport subscribers={subscribers.map(s => ({ email: s.email, date: s.subscribedAt.toISOString() }))} />
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subscribed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-10 text-center text-sm text-gray-500">
                  <Mail className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{sub.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
