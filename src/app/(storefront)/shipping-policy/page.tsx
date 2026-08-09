export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-8">Shipping Policy</h1>
      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900 uppercase">Processing Time</h2>
        <p>All orders are processed within 1–2 business days (excluding weekends and holidays) after payment confirmation. You will receive a shipping confirmation email with tracking information once your order has shipped.</p>
        
        <h2 className="text-xl font-bold text-gray-900 uppercase">Shipping Rates & Delivery Times</h2>
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 p-3 text-left">Method</th>
              <th className="border border-gray-200 p-3 text-left">Delivery Time</th>
              <th className="border border-gray-200 p-3 text-left">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-gray-200 p-3">Standard</td><td className="border border-gray-200 p-3">3–5 business days</td><td className="border border-gray-200 p-3">Rs. 350.00</td></tr>
            <tr><td className="border border-gray-200 p-3">Express</td><td className="border border-gray-200 p-3">1–2 business days</td><td className="border border-gray-200 p-3">Rs. 700.00</td></tr>
            <tr><td className="border border-gray-200 p-3">Free Standard</td><td className="border border-gray-200 p-3">3–5 business days</td><td className="border border-gray-200 p-3">Free on orders over Rs. 5,000</td></tr>
          </tbody>
        </table>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Order Tracking</h2>
        <p>Once your order ships, you will receive an email with a tracking number. You can also track your order from your account dashboard under "My Orders".</p>

        <h2 className="text-xl font-bold text-gray-900 uppercase">Lost or Damaged Packages</h2>
        <p>If your package arrives damaged or is lost in transit, please contact us at <a href="mailto:support@rawclothing.com" className="underline">support@rawclothing.com</a> within 48 hours of the expected delivery date.</p>
      </div>
    </div>
  );
}
