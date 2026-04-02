'use client'

import { useState } from 'react'
import { User, Lock, CreditCard, FileText, Users, Save, Eye, Check, X, Download } from 'lucide-react'
import { pricingPlans } from '@/lib/data'
import PricingCard from '@/components/ui/PricingCard'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'payments', label: 'Payments / Invoices', icon: FileText },
  { id: 'invite', label: 'Invite Colleagues', icon: Users },
]

const invoices = [
  { date: 'Mar 1, 2024', amount: '$195.00', status: 'Paid', plan: 'Basic' },
  { date: 'Feb 1, 2024', amount: '$195.00', status: 'Paid', plan: 'Basic' },
  { date: 'Jan 1, 2024', amount: '$195.00', status: 'Paid', plan: 'Basic' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-headline font-bold bg-tertiary">
              JD
            </div>
            <div>
              <h1 className="font-headline font-bold text-xl text-primary">John Doe</h1>
              <p className="font-body text-sm text-on-surface-variant">john.doe@company.com · Free Plan</p>
            </div>
          </div>
          <div className="flex gap-0 border-t border-surface-container -mb-px">
            {tabs.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-body font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
              <h3 className="font-headline font-semibold text-base text-primary mb-5">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'First Name', value: 'John', required: true },
                  { label: 'Last Name', value: 'Doe', required: true },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      {field.label} {field.required && <span className="text-error">*</span>}
                    </label>
                    <input type="text" defaultValue={field.value} className="input-field" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Phone <span className="text-error">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select className="input-field w-24 shrink-0">
                      <option>+1</option>
                      <option>+44</option>
                      <option>+91</option>
                    </select>
                    <input type="tel" placeholder="555-0100" className="input-field flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Designation <span className="text-error">*</span>
                  </label>
                  <input type="text" placeholder="Senior Analyst" className="input-field" />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
              <h3 className="font-headline font-semibold text-base text-primary mb-5">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Address Line 1', span: 2 },
                  { label: 'Address Line 2', span: 2 },
                  { label: 'City', span: 1 },
                  { label: 'State', span: 1 },
                  { label: 'Zipcode', span: 1 },
                  { label: 'Country', span: 1 },
                ].map(field => (
                  <div key={field.label} className={field.span === 2 ? 'col-span-2' : ''}>
                    <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      {field.label}
                    </label>
                    <input type="text" className="input-field" />
                  </div>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 btn-primary w-fit">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="max-w-md">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
              <h3 className="font-headline font-semibold text-base text-primary mb-5">Change Password</h3>
              <div className="space-y-4">
                {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                  <div key={label}>
                    <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="input-field pr-10"
                      />
                      {i === 0 && (
                        <button onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Eye className="w-4 h-4 text-outline" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-5 w-full">Update Password</button>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div>
            <div className="mb-6 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/8">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-headline font-semibold text-sm text-primary">Current Plan: Free</div>
                <div className="font-body text-xs text-on-surface-variant">Upgrade to unlock more features</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
              {pricingPlans.map(plan => (
                <PricingCard key={plan.id} plan={plan} currentPlan="free" />
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card overflow-hidden">
              <div className="p-5 border-b border-surface-container">
                <h3 className="font-headline font-semibold text-base text-primary">Payment History</h3>
              </div>
              {invoices.length > 0 ? (
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, i) => (
                      <tr key={i}>
                        <td className="font-body text-on-surface-variant">{inv.date}</td>
                        <td className="font-body text-on-surface-variant">{inv.plan}</td>
                        <td className="font-body font-semibold text-primary">{inv.amount}</td>
                        <td>
                          <span className="stat-badge bg-green-100 text-green-700">{inv.status}</span>
                        </td>
                        <td>
                          <button className="flex items-center gap-1 text-xs font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center">
                  <FileText className="w-10 h-10 text-outline mx-auto mb-3" />
                  <p className="font-body text-sm text-on-surface-variant">No invoices yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invite Tab */}
        {activeTab === 'invite' && (
          <div className="max-w-lg">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
              <h3 className="font-headline font-semibold text-base text-primary mb-2">Invite Colleagues</h3>
              <p className="font-body text-sm text-on-surface-variant mb-5">Share Curator Intelligence with your team members.</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="input-field flex-1"
                />
                <button className="btn-primary shrink-0">Send Invite</button>
              </div>
              <div className="mt-6">
                <h4 className="font-headline font-semibold text-xs uppercase tracking-wider text-on-surface-variant mb-3">Pending Invites</h4>
                <div className="text-center py-8 text-on-surface-variant">
                  <Users className="w-8 h-8 mx-auto mb-2 text-outline" />
                  <p className="font-body text-sm">No pending invites</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
