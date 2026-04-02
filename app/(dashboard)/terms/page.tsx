export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Terms of Service</h1>
          <p className="font-body text-sm text-on-surface-variant">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using Curator Intelligence ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use the Platform.',
          },
          {
            title: '2. Description of Service',
            content: 'Curator Intelligence provides market research analytics, reports, and data intelligence services for industries including healthcare, biotechnology, energy, technology, and more. Our services include market outlook reports, company profiles, industry analytics, and AI-powered insights.',
          },
          {
            title: '3. User Accounts',
            content: 'You must register for an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.',
          },
          {
            title: '4. Subscription Plans & Billing',
            content: 'Paid features are available through subscription plans (Starter, Professional, Enterprise). Subscriptions automatically renew unless cancelled before the renewal date. Refunds are provided in accordance with our refund policy. Custom enterprise plans are available upon request.',
          },
          {
            title: '5. Intellectual Property',
            content: 'All content, reports, data, analytics, and materials on the Platform are the intellectual property of Curator Intelligence or its licensors. You may not reproduce, distribute, or create derivative works from our content without express written permission.',
          },
          {
            title: '6. Permitted Use',
            content: 'You may use reports and data for internal business purposes only. Redistribution, resale, or public sharing of purchased reports is strictly prohibited. API access, where provided, must be used in accordance with rate limits and usage guidelines.',
          },
          {
            title: '7. Data Accuracy Disclaimer',
            content: 'While we strive for accuracy, market data, forecasts, and analytics are based on available information and analytical models. Curator Intelligence does not guarantee the accuracy, completeness, or timeliness of any data and shall not be liable for decisions made based on our reports.',
          },
          {
            title: '8. Limitation of Liability',
            content: 'To the maximum extent permitted by law, Curator Intelligence shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or reliance on any data or reports provided.',
          },
          {
            title: '9. Termination',
            content: 'We reserve the right to suspend or terminate your account if you violate these terms. Upon termination, your right to access the Platform ceases immediately, though provisions that by their nature should survive will remain in effect.',
          },
          {
            title: '10. Changes to Terms',
            content: 'We may update these Terms of Service at any time. Continued use of the Platform after changes constitutes acceptance of the revised terms. We will notify registered users of material changes via email.',
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="font-headline font-semibold text-base text-primary mb-2">{section.title}</h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="pt-6 border-t border-surface-container-high">
          <p className="font-body text-xs text-on-surface-variant">
            If you have questions about these terms, please contact us at legal@curatorintelligence.com
          </p>
        </div>
      </div>
    </div>
  )
}
