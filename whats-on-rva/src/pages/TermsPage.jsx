import LegalLayout, { LegalSection } from '../components/LegalLayout.jsx';
import { siteConfig } from '../config/siteConfig.js';

export default function TermsPage() {
  const mail = `mailto:${siteConfig.contactEmail}`;

  return (
    <LegalLayout title="Terms of use">
      <p className="text-sm text-rva-slate/55">Last updated: {siteConfig.policiesLastUpdated}</p>

      <LegalSection title="Agreement">
        <p>
          By using {siteConfig.siteName} (&quot;the site&quot;), operated by{' '}
          <strong className="text-rva-slate">{siteConfig.legalEntity}</strong>, you agree to these
          terms. If you do not agree, do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="What the site does">
        <p>
          The site aggregates <strong className="text-rva-slate">public</strong> arts and culture event
          information for the {siteConfig.regionLabel}. It is provided for{' '}
          <strong className="text-rva-slate">informational purposes only</strong>. We are not the
          organizer of listed events unless we say so explicitly.
        </p>
      </LegalSection>

      <LegalSection title="Tickets and accuracy">
        <p>
          We do not sell tickets. Prices, times, locations, cancellations, and accessibility may
          change.{' '}
          <strong className="text-rva-slate">
            Always confirm details with the venue or organizer
          </strong>{' '}
          using the link we provide before you buy tickets or travel.
        </p>
      </LegalSection>

      <LegalSection title="Third-party content and links">
        <p>
          Listings, images, and links may come from third parties. We do not control that content and
          are not responsible for it. Your use of third-party sites is between you and them.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          The site is provided <strong className="text-rva-slate">&quot;as is&quot;</strong> without
          warranties of any kind. We do not guarantee that the service will be uninterrupted,
          error-free, or complete.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {siteConfig.legalEntity} and its team will not be
          liable for any indirect, incidental, or consequential damages arising from your use of the
          site or reliance on any listing.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may change these terms or the site at any time. Continued use after changes means you
          accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          <a href={mail} className="font-semibold text-rva-river underline underline-offset-2">
            {siteConfig.contactEmail}
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
