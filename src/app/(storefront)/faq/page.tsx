const faqs = [
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3–5 business days. Express delivery is available at checkout and takes 1–2 business days."
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! We offer free standard delivery on all orders over Rs. 5,000."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached."
  },
  {
    question: "How do I return an item?",
    answer: "Simply contact us at returns@rawclothing.com with your order number and reason for return. We'll guide you through the process."
  },
  {
    question: "What sizes do you carry?",
    answer: "We offer sizes XS through 3XL across most of our products. Check the size guide on each product page for detailed measurements."
  },
  {
    question: "Can I change or cancel my order?",
    answer: "Orders can be cancelled within 1 hour of placement. After that, the order goes into processing and cannot be modified."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also view tracking status in your account dashboard."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently we ship within the US, UK, Canada, and Australia. International expansion is coming soon!"
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-4">FAQ</h1>
      <p className="text-gray-600 mb-10">Everything you need to know about RAW Clothing. Can't find your answer? <a href="/contact" className="text-black underline">Contact us</a>.</p>

      <dl className="space-y-6 divide-y divide-gray-200">
        {faqs.map((faq, i) => (
          <div key={i} className="pt-6">
            <dt className="text-base font-semibold text-gray-900">{faq.question}</dt>
            <dd className="mt-2 text-sm text-gray-600">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
