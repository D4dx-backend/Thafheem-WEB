import React from "react";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  const handleBack = () => {
    // Handle navigation back
    console.log("Navigate back");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex border-b border-[#EBEEF0] items-center gap-3">

            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            D4media Privacy Policy Statement
            </h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6 ">
        <div className="bg-white rounded-lg  dark:bg-black p-6">
          <div className="prose prose-gray max-w-none">
            {/* Introduction */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                Introduction:
              </h3>

              <p className="text-sm text-gray-700 leading-relaxed mb-4 dark:text-white">
                The D4media (Dharmadhara Division for Digital Media), Kerala,
                India (referred to as "D4media", "we", "us" and "our") takes
                individuals' privacy seriously. This Statement explains our
                policies and practices and applies to information collection and
                use including but not limited to while you are visiting and
                using Thafheem ul Quran (the "Application") and our Apps. For
                the purposes of the relevant data protection laws in force in
                places including but not limited to India, D4media, is
                controller and/or data user which control the collection,
                holding, processing or use of your personal data on our behalf.
                This Statement is privacy policy for the Site and our Apps.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                1. Collection of Data
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3 dark:text-white">
                We may collect and process the following information about you:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-white">
                <li>
                  Information (such as your name, email address, mailing
                  address, phone number, date of birth, photograph,
                  identification document number, credit card information) that
                  you provide by completing forms on the Site, including if you
                  register as a user of the Site, subscribe to our newsletter,
                  upload or submit any material through the Site, request any
                  information, or enter into any transaction on or through the
                  Site;
                </li>
                <li>
                  In connection with an account sign-in facility, your log-in
                  and password details;
                </li>
                <li>
                  Details of any transactions made by you through the Site;
                </li>
                <li>
                  Communications you send to us, for example to report a problem
                  or to submit queries, concerns or comments regarding the Site
                  or its content; and
                </li>
                <li>
                  Information from surveys that we may, from time to time, run
                  on the Site for research purposes, if you choose to respond
                  to, or participate in, them
                </li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mb-3 dark:text-white">
                You are under no obligation to provide any such information.
                However, if you should choose to withhold requested information,
                we may not be able to provide you with certain services.
              </p>
            </div>

            {/* Additional sections can be added here */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                2. Uses of Data:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3 dark:text-white">
                We use information held about you in the following ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-white">
                <li>
                  To ensure that content from our site is presented in the most
                  effective manner for you and for your computer;
                </li>
                <li>
                  To provide you with information, products or services that you
                  request from us or which we feel may interest you, where you
                  have consented to be contacted for such purposes;
                </li>
                <li>
                  To carry out our obligations arising from any contracts
                  entered into between you and us;
                </li>
                <li>
                  To allow you to participate in interactive features of our
                  service, when you choose to do so;
                </li>
                <li>To notify you about changes to our service;</li>
                <li>
                  To improve our products and services and to ensure that they
                  are relevant to you;
                </li>
                <li>
                  For system administration purposes and for internal
                  operations, including troubleshooting, data analysis, testing,
                  research, statistical and survey purposes;
                </li>
                <li>
                  For the purpose of processing transactions, including
                  processing credit card transactions;
                </li>
                <li>To deliver our newsletters to you;</li>
                <li>
                  To send you information we think you may find useful or which
                  you have requested from us, including information about our
                  products and services or those of carefully selected third
                  parties, provided you have indicated that you do not object to
                  being contacted for these purposes;
                </li>
                <li>
                  For the purpose of providing information to third parties who
                  provide specific services to us; and
                </li>
                <li>
                  Subject to your consent, to notify you of products or special
                  offers that may be of interest to you.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3 dark:text-white">
                3. Disclosure of Data:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                We will keep your personal data we hold confidential but you
                agree we may provide information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-white">
                <li>
                  Any member of our group, which means our subsidiaries, our
                  ultimate holding company and its subsidiaries, as defined in
                  section 15 of the Companies Act, 1956
                </li>
                <li>
                  Personnel, agents, advisers, auditors, contractors, financial
                  institutions, and service providers in connection with our
                  operations or services (for example staff engaged in the
                  fulfillment of your order, the processing of your payment and
                  the provision of support services)
                </li>
                <li>
                  Our overseas offices, affiliates, business partners and
                  counterparts (on a need-to-know basis only)
                </li>
                <li>Persons under a duty of confidentiality to us</li>
                <li>
                  Persons to whom we are required to make disclosure under
                  applicable laws in or outside India
                </li>
                <li>
                  Actual or proposed transferees or participants of our services
                </li>
                <li>
                  Parties or entities from whom we receive subsidies or special
                  funding support for audit purpose
                </li>
              </ul>

              <p className="text-sm text-gray-700 mt-4  dark:text-white">
                We may provide your personal data as required or permitted by
                law to comply with a summons, subpoena or similar legal process
                or government request, or when we believe in good faith that
                disclosure is legally required or otherwise necessary to protect
                our rights and property, or the rights, property or safety of
                others, including but not limited to advisers, law enforcement,
                judicial and regulatory authorities in or outside India. We may
                also transfer your personal data to a third party that acquires
                all or part of our assets or shares, or that succeeds us in
                carrying on all or a part of our business, whether by merger,
                acquisition, reorganisation or otherwise.
              </p>

              <p className="text-sm text-gray-700 mt-4 dark:text-white">
                To prevent and detect crimes and to protect the security and
                safety of our events and trade fairs, we may provide your
                personal identification data such as your full passport/identity
                card no., date of birth and nationality to the law enforcement
                authorities in India including the India Police Force,
                Immigration Department, Customs and Excise Department and other
                similar authorities upon their lawful request (but not to any
                other third party save as expressly specified below).
              </p>

              <p className="text-sm text-gray-700 mt-4 dark:text-white">
                We may also provide your passport or identity card number to
                personnel, agents, auditors, contractors and service providers
                in connection with the organisation of our events, persons under
                a duty of confidentiality to us and/or persons to whom we are
                required to make disclosure under applicable laws in or outside
                India.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3 ">
                4. Cookies:
              </h3>
              <p className="text-sm text-gray-700 dark:text-white">
                Cookies are small, sometimes encrypted text files that are
                stored on computer hard drives by websites that you visit. They
                are used to help you to navigate on websites efficiently as well
                as to provide information to the owner of the website. Cookies
                do not contain any software programs. There are two general
                types of cookies, session cookies and persistent cookies.
                Session cookies are only used during a session online and will
                be deleted once you leave a website. Persistent cookies have a
                longer life and will be retained by the website and used each
                time you visit a website. Both session and persistent cookies
                can be deleted by you at anytime through your browser settings
                and in any event, will not be kept longer than necessary.
              </p>

              <p className="text-sm text-gray-700 mt-4 dark:text-white">
                We use cookies to find out more about the use of our Site and
                user preferences to improve our services. We may provide
                summarised traffic data to advertisers solely for the purpose of
                customising the advertising to you. We note traffic, pages
                visited and time spent. We store your shopping cart and wish
                list for your later use. We may link the information to you, so
                that you may receive information more suited to your interests.
              </p>

              <p className="text-sm text-gray-700 mt-4 dark:text-white">
                Web browsers often allow you to erase existing cookies from your
                hard drive, block the use of cookies and/or be notified when
                cookies are encountered. If you elect to block cookies, please
                note that you may not be able to take full advantage of the
                features and functions of the Site. Cookies are necessary for
                some features of the website to work, e.g., to maintain
                continuity during a browser session.
              </p>

              <p className="text-sm text-gray-700 mt-4 dark:text-white ">
                We use an email delivery and marketing company to send emails
                that you have agreed to receive. Pixels tags and cookies are
                used in those emails and at our Site to help us measure the
                effectiveness of our advertising and how visitors use our web
                site.
              </p>

              <p className="text-sm text-gray-700 mt-4 dark:text-white">
                We use a third-party advertising company to serve ads when you
                visit our Site. This company may use information (not including
                your name, address, email address or telephone number) about
                your visit to this Site in order to provide advertisements about
                goods and services that may be of interest to you. In the course
                of serving advertisements to this site, our third-party
                advertiser may place or recognise a unique "cookie" on your
                browser. If you would like more information about this practice
                and to know your choices about not having this information used
                by this company, please refer to the cookie policy of respective
                company directly.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                5. Security:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                Personal data stored electronically are password-protected.
                Encryption technology is used on our secured web areas. Our
                computer systems are placed in restricted areas. We only permit
                authorised employees to access personal data. These employees
                are trained on our privacy policies.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                6. Hyperlinks:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                The Site may, from time to time, contain links to external sites
                operated by third parties for your convenience. We have no
                control of and are not responsible for these third party sites
                or the content thereof. Once you leave the Site, we cannot be
                responsible for the protection and privacy of any information
                which you provide to these third party sites. You should
                exercise caution and look at the privacy statement for the
                website you visit.
              </p>
            </div>


            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                7. Changes:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                We may update this Statement. When we do, the changes will be
                posted on www.d4media.in/privacy-policy/.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                8. Data transfers:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                We will generally hold your data on our servers hosted in India.
                However, we may transfer it to elsewhere in the world for the
                purpose of processing into our database or to any of the people
                listed at paragraph 3 above, who may be located elsewhere. If
                you are located in the European Economic Area ("EEA") /"UK" your
                personal data may be transferred to countries located outside
                the EEA /"UK" which do not provide a similar or adequate level
                of protection to that provided by countries in the EEA /"UK".
                Such transfers will only be made in accordance with applicable
                laws including where necessary for us to comply with our
                contractual obligations with you. We will take all steps
                reasonably necessary to ensure that any personal data are
                treated securely and in accordance with this Statement.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#2AA0BF] mb-3">
                9. Your data privacy rights:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                By using our service, making an application or visiting our
                Site, you acknowledge the collection and use of your personal
                data by us as outlined in this Statement. If you do not agree
                with the use of your personal data as set out in this Statement,
                please do not use this Site or our Apps.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed dark:text-white">
                If you wish to exercise one of the above mentioned rights, cease
                marketing communications, and/or raise questions or complaints,
                please contact us at:
              </p>
            </div>

            <div className="text-sm text-gray-700 mt-8 dark:text-white">
  <p className="font-semibold">Data Privacy Officer</p>
  <p className="font-semibold">D4Media</p>
  <p>Hira Centre, Mavoor Road, Kozhikode, Kerala, India</p>

  <p className="mt-2">
    Tel: <a href="tel:+91994668139" className="text-blue-600 hover:underline dark:text-[#4FAEC7]">(+91) 99466 68139</a>
  </p>
  <p>
    E-mail: <a href="mailto:info@d4media.in" className="text-blue-600 hover:underline dark:text-[#4FAEC7]">info@d4media.in</a>
  </p>
  <p>
    Website: <a href="https://d4media.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-[#4FAEC7]">https://d4media.in/</a>
  </p>

  <p className="mt-4 dark:text-white">Last updated on 10-02-2024</p>
  <p className="mt-2 font-semibold dark:text-white">© 2025 D4Media</p>
</div>


            {/* Last Updated */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div> */}
          </div>
        </div>
      </div>
      </div>

      {/* Content */}

    </div>
  );
};

export default Privacy;
