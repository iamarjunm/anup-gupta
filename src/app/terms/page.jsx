// components/TermsAndConditions.jsx or pages/terms-and-conditions.jsx
import React from 'react';
import Head from 'next/head'; // For setting page title and meta descriptions

const TermsAndConditions = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Your Website Name</title>
        <meta name="description" content="Read the terms and conditions for using our website and services." />
      </Head>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-8 text-center">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 text-sm mb-12 text-center">
          Last updated: June 8, 2025
        </p>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <p className="mb-6">
            Welcome to Anup Gupta Studio! These terms and conditions outline the rules and regulations for the use of Anup Gupta Studio's Website, located at https://anupguptastudio.com/.
          </p>

          <p className="mb-6">
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Anup Gupta Studio if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <p className="mb-6">
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of [Your Country]. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">Cookies</h2>
          <p className="mb-6">
            We employ the use of cookies. By accessing Anup Gupta Studio, you agreed to use cookies in agreement with the Anup Gupta Studio's Privacy Policy.
          </p>
          <p className="mb-6">
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">License</h2>
          <p className="mb-6">
            Unless otherwise stated, Anup Gupta Studio and/or its licensors own the intellectual property rights for all material on Anup Gupta Studio. All intellectual property rights are reserved. You may access this from Anup Gupta Studio for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="mb-6">You must not:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Republish material from Anup Gupta Studio</li>
            <li>Sell, rent or sub-license material from Anup Gupta Studio</li>
            <li>Reproduce, duplicate or copy material from Anup Gupta Studio</li>
            <li>Redistribute content from Anup Gupta Studio</li>
          </ul>
          <p className="mb-6">
            This Agreement shall begin on the date hereof.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">Hyperlinking to our Content</h2>
          <p className="mb-6">
            The following organizations may link to our Website without prior written approval:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
            <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
          </ul>
          <p className="mb-6">
            We may consider and approve other link requests from the following types of organizations:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>commonly-known consumer and/or business information sources;</li>
            <li>dot.com community sites;</li>
            <li>associations or other groups representing charities;</li>
            <li>online directory distributors;</li>
            <li>internet portals;</li>
            <li>accounting, law and consulting firms; and</li>
            <li>educational institutions and trade associations.</li>
          </ul>
          <p className="mb-6">
            If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to [Your Email Address]. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Allow 2-3 weeks for a response.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">iFrames</h2>
          <p className="mb-6">
            Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">Content Liability</h2>
          <p className="mb-6">
            We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">Reservation of Rights</h2>
          <p className="mb-6">
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">Removal of links from our website</h2>
          <p className="mb-6">
            If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
          </p>
          <p className="mb-6">
            We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
          </p>

          <h2 className="text-3xl font-serif font-light text-gray-900 mt-10 mb-4">Disclaimer</h2>
          <p className="mb-6">
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
          <p className="mb-6">
            The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
          </p>
          <p className="mb-6">
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;