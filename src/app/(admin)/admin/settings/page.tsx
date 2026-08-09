import { prisma } from "@/lib/prisma";
import HomepageSettingsForm from "@/components/admin/HomepageSettingsForm";

export default async function AdminSettingsPage() {
  const setting = await prisma.homepageSetting.findFirst();
  const config = (setting?.config ?? {}) as Record<string, any>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Customize the content that appears on your homepage. Changes take effect immediately.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-8">
        <HomepageSettingsForm initialConfig={config} />
      </div>
    </div>
  );
}
