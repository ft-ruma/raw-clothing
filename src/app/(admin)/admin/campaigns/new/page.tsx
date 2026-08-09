import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CampaignForm from "@/components/admin/CampaignForm";
import { createCampaign } from "@/actions/campaign";

export default function NewCampaignPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/campaigns" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Campaigns
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Campaign</h1>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <CampaignForm action={createCampaign} />
      </div>
    </div>
  );
}
