export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-8">About RAW</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p className="text-lg">RAW Clothing is a premium streetwear brand built for those who refuse to blend in. Founded on the principles of quality, authenticity, and self-expression, every piece we create is designed to be worn, lived in, and loved.</p>
        <h2 className="text-2xl font-bold text-gray-900 uppercase mt-8">Our Story</h2>
        <p>RAW started as a small passion project, turning into a movement. We believe in clothes that mean something — pieces that carry culture, built with craftsmanship, and designed for everyday wear that never looks ordinary.</p>
        <h2 className="text-2xl font-bold text-gray-900 uppercase mt-8">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Quality First:</strong> We source only premium materials and work with manufacturers who share our standards.</li>
          <li><strong>Authenticity:</strong> Every design is original — created in-house with purpose and intention.</li>
          <li><strong>Community:</strong> RAW is built by the people who wear it. Our customers inspire everything we do.</li>
          <li><strong>Sustainability:</strong> We are committed to reducing our environmental footprint across our entire supply chain.</li>
        </ul>
      </div>
    </div>
  );
}
