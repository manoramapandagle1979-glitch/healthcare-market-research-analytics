export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Cookie Policy</h1>
          <p className="font-body text-sm text-on-surface-variant">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h2 className="font-headline font-semibold text-base text-primary mb-2">What Are Cookies</h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Cookies are small text files stored on your device when you visit our platform. They help us provide a better experience by remembering your preferences, keeping you signed in, and understanding how you use our services.
          </p>
        </div>

        <div>
          <h2 className="font-headline font-semibold text-base text-primary mb-3">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {[
              { type: 'Essential Cookies', desc: 'Required for the platform to function. These handle authentication, security, and basic functionality. They cannot be disabled.', always: true },
              { type: 'Analytics Cookies', desc: 'Help us understand how visitors interact with our platform by collecting anonymous usage data. This helps us improve our services and content.', always: false },
              { type: 'Preference Cookies', desc: 'Remember your settings and preferences such as language, display options, and recently viewed reports for a personalized experience.', always: false },
              { type: 'Performance Cookies', desc: 'Monitor platform performance, load times, and error rates to ensure a smooth and reliable experience.', always: false },
            ].map(cookie => (
              <div key={cookie.type} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline font-semibold text-sm text-primary">{cookie.type}</h3>
                  <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${cookie.always ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {cookie.always ? 'Always Active' : 'Optional'}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">{cookie.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-headline font-semibold text-base text-primary mb-2">Managing Cookies</h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our platform. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
          </p>
        </div>

        <div>
          <h2 className="font-headline font-semibold text-base text-primary mb-2">Third-Party Cookies</h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Some cookies are placed by third-party services that appear on our pages, such as analytics providers and payment processors. We do not control these cookies and recommend reviewing the respective third-party privacy policies.
          </p>
        </div>

        <div className="pt-6 border-t border-surface-container-high">
          <p className="font-body text-xs text-on-surface-variant">
            For questions about our cookie practices, contact us at privacy@curatorintelligence.com
          </p>
        </div>
      </div>
    </div>
  )
}
