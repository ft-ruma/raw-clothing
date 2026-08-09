import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Plus, Zap, ZapOff, Trash2 } from "lucide-react";
import CampaignActions from "@/components/admin/CampaignActions";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-sm text-gray-700">Manage promotional campaigns and banners.</p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Zap className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900">No campaigns yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first promotional campaign.</p>
          <Link href="/admin/campaigns/new" className="mt-4 inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const isExpired = new Date(campaign.endDate) < new Date();
            return (
              <div key={campaign.id} className={`bg-white rounded-xl shadow-sm ring-1 overflow-hidden ${campaign.isActive ? "ring-indigo-400" : "ring-gray-200"}`}>
                {/* Banner image */}
                {campaign.imageUrl ? (
                  <div className="relative h-36 bg-gray-100">
                    <Image src={campaign.imageUrl} alt={campaign.name} fill className="object-cover" sizes="400px" />
                    {campaign.isActive && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">ACTIVE</div>
                    )}
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-gray-300" />
                    {campaign.isActive && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">ACTIVE</div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                  {campaign.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{campaign.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {isExpired ? "Expired" : `Ends ${new Date(campaign.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  <CampaignActions campaignId={campaign.id} isActive={campaign.isActive} isExpired={isExpired} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
