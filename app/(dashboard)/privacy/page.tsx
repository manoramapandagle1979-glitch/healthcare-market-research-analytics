export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Privacy Policy</h1>
          <p className="font-body text-sm text-on-surface-variant">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {[
          {
            title: '1. Information We Collect',
            content: 'We collect information you provide directly (name, email, company, job title) when you register, subscribe, or contact us. We also collect usage data including pages viewed, reports accessed, search queries, and interaction patterns to improve our services.',
          },
          {
            title: '2. How We Use Your Information',
            content: 'Your information is used to provide and improve our services, process subscriptions and payments, send relevant market updates and communications, personalize your experience, and generate anonymized analytics to enhance our platform.',
          },
          {
            title: '3. Data Sharing',
            content: 'We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform (payment processors, cloud hosting, analytics), and when required by law or to protect our rights.',
          },
          {
            title: '4. Data Security',
            content: 'We implement industry-standard security measures including encryption in transit and at rest, regular security audits, access controls, and secure data centers. However, no method of transmission over the internet is 100% secure.',
          },
          {
            title: '5. Cookies & Tracking',
            content: 'We use cookies and similar technologies for authentication, preferences, analytics, and performance optimization. You can manage cookie preferences through your browser settings. See our Cookie Policy for more details.',
          },
          {
            title: '6. Your Rights',
            content: 'Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. You may also opt out of marketing communications at any time. To exercise these rights, contact our privacy team.',
          },
          {
            title: '7. Data Retention',
            content: 'We retain your personal information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal compliance, dispute resolution, or legitimate business purposes for up to 3 years.',
          },
          {
            title: '8. International Transfers',
            content: 'Your data may be processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable data protection laws.',
          },
          {
            title: '9. Children\'s Privacy',
            content: 'Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn we have collected data from a child, we will delete it promptly.',
          },
          {
            title: '10. Changes to This Policy',
            content: 'We may update this Privacy Policy periodically. We will notify you of material changes via email or through a notice on our platform. Your continued use after changes constitutes acceptance.',
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="font-headline font-semibold text-base text-primary mb-2">{section.title}</h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="pt-6 border-t border-surface-container-high">
          <p className="font-body text-xs text-on-surface-variant">
            For privacy inquiries, contact us at privacy@curatorintelligence.com
          </p>
        </div>
      </div>
    </div>
  )
}
