export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <p>RAW Clothing ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information about you when you use our website.</p>
        
        <h2 className="text-xl font-bold text-gray-900 uppercase">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account information:</strong> Name, email address, and password when you create an account.</li>
          <li><strong>Order information:</strong> Billing address, shipping address, and payment details (processed securely — we never store full card numbers).</li>
          <li><strong>Usage data:</strong> Pages visited, products viewed, and interactions with the site.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 uppercase">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To process and fulfill your orders.</li>
          <li>To send transactional emails (order confirmations, shipping updates).</li>
          <li>To improve our products, services, and website.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal data. Payment information is encrypted and processed through secure payment gateways. We never store complete credit card details on our servers.</p>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. Contact us at <a href="mailto:privacy@rawclothing.com" className="underline">privacy@rawclothing.com</a> to exercise these rights.</p>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Contact</h2>
        <p>For privacy-related questions, please contact us at <a href="mailto:privacy@rawclothing.com" className="underline">privacy@rawclothing.com</a>.</p>
      </div>
    </div>
  );
}
