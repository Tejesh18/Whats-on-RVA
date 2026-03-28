import LegalLayout, { LegalSection } from '../components/LegalLayout.jsx';
import { siteConfig } from '../config/siteConfig.js';

export default function PrivacyPolicyPage() {
  const mail = `mailto:${siteConfig.contactEmail}`;

  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm text-rva-slate/55">Last updated: {siteConfig.policiesLastUpdated}</p>

      <LegalSection title="Who we are">
        <p>
          {siteConfig.siteName} is operated by <strong className="text-rva-slate">{siteConfig.legalEntity}</strong>{' '}
          (&quot;we,&quot; &quot;us&quot;). This policy describes how we handle information in connection
          with our website at {siteConfig.publicSiteUrl}.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>
          You can browse listings without signing in. If you choose <strong>Register</strong> or{' '}
          <strong>Sign in</strong>, we store your email and a one-way hash of your password in{' '}
          <strong>this browser&apos;s local storage only</strong> (not on our servers unless you later
          connect a real backend). Do not reuse an important password; treat demo accounts as local
          convenience only.
        </p>
        <p>
          Your browser and our hosting provider may create standard server logs (such as IP address,
          browser type, and time of request) when you load pages. Those providers process data under
          their own privacy policies.
        </p>
        <p>
          If you email us, we receive the address you use and the contents of your message so we can
          respond.
        </p>
      </LegalSection>

      <LegalSection title="Event listings">
        <p>
          Listings and images come from public sources (CultureWorks and, when configured, Eventbrite
          search). We filter to <strong>Richmond city limits</strong> on our side when possible, but
          always verify the venue address on the organizer&apos;s page.
        </p>
        <p>
          When you follow &quot;Get tickets / details,&quot; you leave our site; those organizations
          have their own privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and local storage">
        <p>
          We use local storage for optional sign-in state and hashed credentials as described above.
          We do not use cookies or storage to track you across other sites. If we add analytics or
          server-backed accounts, we will update this policy.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The site is a general audience event guide. It is not directed at children under 13, and
          we do not knowingly collect their personal information.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top
          will change when we do.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about privacy:{' '}
          <a href={mail} className="font-semibold text-rva-river underline underline-offset-2">
            {siteConfig.contactEmail}
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
