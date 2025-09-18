import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-width-container section-padding">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          <p className="text-gray-600 mb-6">Company: KinPin (hereinafter referred to as “Company,” “We,” “Our,” or “Us”). Jurisdiction: India</p>
          <p className="text-gray-600 mb-8">By accessing, browsing, or using the KinPin website/application (“Platform”) and booking services through it, you (“User,” “You,” or “Customer”) agree to comply with and be bound by the following Terms and Conditions.</p>

          <div className="space-y-6 text-gray-800">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Nature of Services</h2>
              <p>1.1 KinPin provides medical attender and assistance services for outpatients and individuals who require support in visiting hospitals, clinics, or healthcare facilities.</p>
              <p>1.2 Our attenders are not doctors, nurses, or licensed healthcare providers. They cannot provide medical advice, diagnosis, or treatment.</p>
              <p>1.3 The services are limited to accompaniment, assistance in communication with medical staff, logistical support, and basic non-medical guidance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
              <p>2.1 You must be at least 18 years of age to book services.</p>
              <p>2.2 If booking on behalf of another person (e.g., patient), you confirm that you are authorized to do so.</p>
              <p>2.3 By using KinPin, you confirm that the patient does not require emergency medical services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Booking and Payments</h2>
              <p>3.1 All bookings must be made through the KinPin Platform.</p>
              <p>3.2 Service fees are displayed at the time of booking and must be paid in advance.</p>
              <p>3.3 Payment methods may include UPI, debit/credit card, net banking, or other options available on the Platform.</p>
              <p>3.4 The Company reserves the right to reject or cancel bookings at its discretion.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Cancellations and Refunds</h2>
              <p>4.1 Cancellations made more than 5 hours before the appointment will be eligible for a partial refund (subject to administrative fees).</p>
              <p>4.2 Cancellations made less than 2 hours before the appointment will not be refunded.</p>
              <p>4.3 If the Company cancels a booking, a full refund will be processed.</p>
              <p>4.4 Refunds will be initiated within [7–10] business days.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. User Responsibilities</h2>
              <p>5.1 The User must provide accurate, complete, and truthful details at the time of booking.</p>
              <p>5.2 Users must ensure that patients are medically stable for attender services.</p>
              <p>5.3 Users are responsible for informing KinPin and the attender about any special needs, health conditions, or mobility concerns in advance.</p>
              <p>5.4 The User must treat attenders with dignity, respect, and safety.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Company Responsibilities and Limitations</h2>
              <p>6.1 The Company will make reasonable efforts to assign qualified attenders for bookings.</p>
              <p>6.2 The Company is not responsible for: Medical negligence or outcomes of treatment by hospitals/doctors. Any loss, injury, accident, or delay outside its control (including traffic, hospital wait times, third-party actions).</p>
              <p>6.3 Attenders are not permitted to administer medication, perform medical procedures, or take independent medical decisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Safety and Conduct</h2>
              <p>7.1 KinPin follows safety protocols to verify attenders’ identity and background.</p>
              <p>7.2 Attenders and Users must comply with applicable laws during service.</p>
              <p>7.3 Any abusive, unlawful, or inappropriate conduct will result in immediate termination of service without refund.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Liability Disclaimer</h2>
              <p>8.1 The Company acts solely as a service provider of non-medical attender assistance.</p>
              <p>8.2 The Company shall not be held liable for: Death, injury, medical complications, or adverse outcomes. Errors or miscommunication between User, attender, and healthcare providers. Delays, cancellations, or unavailability of attenders.</p>
              <p>8.3 The User agrees to indemnify and hold harmless KinPin, its employees, agents, and affiliates from any claims, damages, or liabilities arising out of service usage.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Privacy and Data Protection</h2>
              <p>9.1 The Company collects and processes personal information in accordance with Indian data protection laws.</p>
              <p>9.2 Data such as name, contact details, health information (if provided), and booking details may be stored for service purposes.</p>
              <p>9.3 We will not share User data with third parties except as required by law or necessary for providing services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Intellectual Property</h2>
              <p>10.1 All content on the Platform, including logos, trademarks, service descriptions, and design, are the property of KinPin.</p>
              <p>10.2 Users may not copy, reproduce, or misuse any content without prior written consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">11. Termination</h2>
              <p>11.1 The Company may suspend or terminate access to services if: The User violates these Terms. Fraudulent or abusive activity is detected. Required by law or regulatory authorities.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">12. Governing Law & Dispute Resolution</h2>
              <p>12.1 These Terms are governed by the laws of India.</p>
              <p>12.2 Any disputes will be subject to the exclusive jurisdiction of the courts in [Insert City, India].</p>
              <p>12.3 The Company encourages resolution through arbitration or mediation before litigation.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">13. Updates to Terms</h2>
              <p>13.1 The Company reserves the right to amend these Terms at any time.</p>
              <p>13.2 Users will be notified of significant changes via the Platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">14. Contact Information</h2>
              <p>For any queries, complaints, or disputes, you may contact us at:</p>
              <p>📧 Email: contact@kinpin.in</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;