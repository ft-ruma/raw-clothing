export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-10">Have a question? We're here to help. Fill out the form below and we'll get back to you within 24 hours.</p>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-black focus:border-black sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-black focus:border-black sm:text-sm" />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" id="subject" name="subject" className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-black focus:border-black sm:text-sm" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" name="message" rows={5} className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-black focus:border-black sm:text-sm" />
        </div>
        <button type="submit" className="w-full bg-black text-white py-3 px-6 font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors">
          Send Message
        </button>
      </form>

      <div className="mt-12 pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-600">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
          <p>support@rawclothing.com</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
          <p>Mon–Fri, 9am–6pm</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
          <p>Within 24 hours</p>
        </div>
      </div>
    </div>
  );
}
