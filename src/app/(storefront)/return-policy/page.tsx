export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-8">Return Policy</h1>
      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <p className="text-base">We have a 30-day return policy. To be eligible for a return, your item must be in the same condition that you received it — unworn, unwashed, with tags still attached, and in its original packaging.</p>

        <h2 className="text-xl font-bold text-gray-900 uppercase">How to Return</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Email us at <a href="mailto:returns@rawclothing.com" className="underline">returns@rawclothing.com</a> with your order number and reason for return.</li>
          <li>We'll send you a return shipping label and instructions.</li>
          <li>Drop your package off at the designated courier.</li>
          <li>Once we receive and inspect your return, we'll notify you and process your refund.</li>
        </ol>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Refunds</h2>
        <p>Once your return is inspected and approved, your refund will be processed within 5–10 business days back to your original payment method. You'll receive an email confirmation when it's done.</p>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Non-Returnable Items</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Items marked as "Final Sale"</li>
          <li>Items without original tags or packaging</li>
          <li>Items showing signs of wear or washing</li>
          <li>Gift cards</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Exchanges</h2>
        <p>The fastest way to get a different size or colour is to return your item and place a new order separately.</p>
      </div>
    </div>
  );
}
