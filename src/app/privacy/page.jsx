// components/PrivacyPolicy.jsx or pages/privacy-policy.jsx
import React from 'react';
import Head from 'next/head'; // For setting page title and meta descriptions

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Head>
        <title>Privacy Policy | Anup Gupta Studio</title>
        <meta name="description" content="Understand how we collect, use, and protect your personal information." />
      </Head>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-8 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-sm mb-12 text-center">
          Last updated: {currentDate}
        </p>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <p className="mb-6">
            Your privacy is critically important to us. This Privacy Policy describes how Anup Gupta Studio ("we," "us," or "our") collects, uses, and discloses information that we obtain about visitors to our website, https://anupguptastudio.com/ (the "Site"), and the services available through our Site (the "Services").
          </p>
          <p className="mb-6">
            By visiting the Site or using any of our Services, you agree that your personal information will be handled as described in this Policy. Your use of our Site or Services, and any dispute over privacy, is subject to this Policy and our Terms and Conditions, including its applicable limitations on damages and the resolution of disputes. Our Terms and Conditions are incorporated by reference into this Policy.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            1. Information We Collect
          </h2>

          <h3 className="text-2xl font-serif font-light text-gray-900 mt-8 mb-3">
            1.1. Information You Provide to Us
          </h3>
          <p className="mb-6">
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Create an account or register for our Services.</li>
            <li>Make a purchase or place an order.</li>
            <li>Subscribe to our newsletter or other communications.</li>
            <li>Participate in surveys, contests, or promotions.</li>
            <li>Contact us for customer support or inquiries.</li>
            <li>Provide reviews or testimonials.</li>
            <li>Fill out forms on the Site.</li>
          </ul>
          <p className="mb-6">
            The types of personal information we may collect include your name, email address, postal address, phone number, payment information (processed by third-party payment processors), and any other information you choose to provide.
          </p>

          <h3 className="text-2xl font-serif font-light text-gray-900 mt-8 mb-3">
            1.2. Information We Collect Automatically
          </h3>
          <p className="mb-6">
            When you visit our Site, we automatically collect certain information about your device and your interaction with our Site. This information may include:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Log Data:</strong> Your IP address, browser type, operating system, referring URLs, pages viewed, and access times.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> Information collected through cookies, web beacons, and similar technologies (e.g., Google Analytics). This may include your Browse behavior, preferences, and patterns of use on our Site.</li>
            <li><strong>Device Information:</strong> Information about the computer or mobile device you use to access our Site, including hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
          </ul>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="mb-6">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>To provide, maintain, and improve our Site and Services.</li>
            <li>To process your orders and transactions.</li>
            <li>To communicate with you about your account, orders, and our Services.</li>
            <li>To send you marketing and promotional communications (if you have opted in).</li>
            <li>To personalize your experience on our Site.</li>
            <li>To analyze and understand how users access and use our Site and Services, for research and analytics purposes.</li>
            <li>To detect, prevent, and address technical issues, fraud, or other illegal activities.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            3. How We Share Your Information
          </h2>
          <p className="mb-6">
            We may share your personal information with third parties in the following circumstances:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf (e.g., payment processing, shipping, analytics, marketing, hosting).</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, dissolution, or sale of all or a portion of our assets, your information may be transferred.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
            <li><strong>Protection of Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, or situations involving threats to the safety of any person.</li>
            <li><strong>With Your Consent:</strong> We may share your information with your explicit consent or at your direction.</li>
          </ul>
          <p className="mb-6">
            We do not sell your personal information to third parties.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            4. Your Choices and Rights
          </h2>
          <p className="mb-6">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Access and Correction:</strong> You may access and update certain personal information associated with your account by logging into your account or contacting us.</li>
            <li><strong>Opt-Out of Marketing:</strong> You can opt out of receiving promotional emails from us by following the unsubscribe instructions provided in those emails. Even if you opt out, we may still send you non-promotional communications, such as those about your account or orders.</li>
            <li><strong>Cookies:</strong> Most web browsers are set to accept cookies by default. If you prefer, you can usually set your browser to remove or reject cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Site.</li>
            <li><strong>Data Subject Rights (e.g., GDPR, CCPA):</strong> If you are in the EU/EEA, UK, or California, you may have additional rights such as the right to erasure, restriction of processing, data portability, and the right to object to processing. Please contact us to exercise these rights.</li>
          </ul>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            5. Data Security
          </h2>
          <p className="mb-6">
            We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage is completely secure, so we cannot guarantee absolute security.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            6. Third-Party Links
          </h2>
          <p className="mb-6">
            Our Site may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            7. Children's Privacy
          </h2>
          <p className="mb-6">
            Our Site is not intended for children under the age of [e.g., 13, or applicable legal age in your jurisdiction]. We do not knowingly collect personal information from children without parental consent. If you believe we have inadvertently collected such information, please contact us so we can promptly delete it.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            8. Changes to This Privacy Policy
          </h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
          </p>
          
          ---

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">
            9. Contact Us
          </h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>General Inquiries & Appointments Email:</strong> Anupguptaclothingstudio@gmail.com</li>
            <li><strong>Customer Support Email:</strong> info@anupguptastudio.com</li>
            <li>
              <strong>India Manufacturing Address:</strong>
              <br />
              18 Nehru Housing Society
              <br />
              Ambedkar Road
              <br />
              Ghaziabad. 201001
              <br />
              Uttar Pradesh
              <br />
              <strong>Contact (India):</strong> 0120-4292177, 0120-4381454
            </li>
            <li>
              <strong>India Showroom Address:</strong>
              <br />
              Anup Gupta
              <br />
              IInd A-1
              <br />
              Nehru Nagar
              <br />
              Ghaziabad. 201001
              <br />
              Uttar Pradesh
              <br />
              <strong>Contact (India Showroom):</strong> 0120-4387417, 0120-4440789
            </li>
            <li>
              <strong>Canada Atelier Address:</strong>
              <br />
              36 Cattrick street
              <br />
              Mississauga
              <br />
              L4T1H5
              <br />
              <strong>Contact (Canada):</strong> 647-926-9903, 416-213-1425
            </li>
          </ul>
          <p className="mb-6">
            Please note that our phone lines operate Monday - Friday: 9 AM - 6 PM IST.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;