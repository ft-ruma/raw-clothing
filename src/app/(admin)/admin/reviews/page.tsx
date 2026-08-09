import { prisma } from "@/lib/prisma";
import ReviewActions from "@/components/admin/ReviewActions";
import { Star } from "lucide-react";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const showFilter = filter === "approved" ? true : filter === "pending" ? false : undefined;

  const reviews = await prisma.review.findMany({
    where: showFilter === undefined ? {} : { isApproved: showFilter },
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const allCount = await prisma.review.count();
  const pendingCount = await prisma.review.count({ where: { isApproved: false } });
  const approvedCount = await prisma.review.count({ where: { isApproved: true } });

  const tabs = [
    { label: `All (${allCount})`, value: "all" },
    { label: `Pending (${pendingCount})`, value: "pending" },
    { label: `Approved (${approvedCount})`, value: "approved" },
  ];

  const activeFilter = filter || "all";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-2 text-sm text-gray-700">Approve or reject customer reviews before they appear on the site.</p>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <a
              key={tab.value}
              href={`/admin/reviews${tab.value === "all" ? "" : `?filter=${tab.value}`}`}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeFilter === tab.value
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Review</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-500">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{review.customerName}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{review.product.name}</td>
                  <td className="px-3 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-600 max-w-xs">
                    <p className="truncate">{review.text}</p>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <ReviewActions reviewId={review.id} isApproved={review.isApproved} />
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
