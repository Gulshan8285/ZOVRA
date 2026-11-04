import React from "react";

export const metadata = {
  title: "Privacy Policy | ZOVRA Men's Home Wellness",
  description: "Learn how ZOVRA handles customer data, address privacy, phone numbers, and confidentiality.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Legal & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400">Last updated: November 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">1. Commitment to Customer Privacy</h2>
            <p>
              At ZOVRA (operated by ZOVRA Wellness Pvt. Ltd.), we treat customer confidentiality as our highest priority. Because our services are delivered inside personal homes, we adhere to strict data-protection principles. We never sell, rent, or trade your personal information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">2. Information We Collect</h2>
            <p>To schedule and safely deliver home massage appointments, we collect:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
              <li>Contact details: Name, mobile number, and email address.</li>
              <li>Delivery address: House/flat number, apartment/society, street, landmark, and PIN code.</li>
              <li>Appointment preferences: Chosen therapy, duration, selected add-ons, date, and time slot.</li>
              <li>Feedback: Voluntary reviews and ratings submitted after service completion.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">3. How Your Data Is Protected</h2>
            <p>
              Your address and contact details are only disclosed to the specific certified male therapist assigned to your appointment, strictly for navigation and service delivery during your slot window. Our database enforces strict access controls and encrypted channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">4. Cash on Delivery & Financial Data</h2>
            <p>
              Because ZOVRA operates on a 100% Cash on Delivery (COD) basis, we do not request, store, or process raw credit card numbers or banking CVVs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">5. Contact Information</h2>
            <p>
              For privacy requests or data deletion queries, contact our Data Protection Officer at:{" "}
              <a href="mailto:privacy@zovra.in" className="text-zovra-deepBlue font-semibold underline">
                privacy@zovra.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
