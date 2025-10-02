import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Star className="h-7 w-7 text-blue-600 fill-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Trustlet</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees or surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-slate-300 transition-all">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  $0
                  <span className="text-lg text-slate-600 font-normal">/month</span>
                </div>
                <CardDescription className="text-base">
                  Perfect for trying out Trustlet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Up to 5 reviews</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Basic review widget</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Review form link</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Email review requests</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Dashboard analytics</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full" size="lg">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-600 shadow-lg relative hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Paid</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  $9
                  <span className="text-lg text-slate-600 font-normal">/month</span>
                </div>
                <CardDescription className="text-base">
                  Everything you need to grow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Unlimited reviews</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Custom widget styling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Review form link</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Unlimited email requests</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Priority support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full" size="lg">
                    Upgrade to Paid
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Yes! You can cancel your subscription at any time. Your plan will remain active until the end of your billing period.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens to my reviews if I downgrade?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    All your reviews remain safe. On the free plan, you can view all reviews but can only collect up to 5 total. Upgrade anytime to collect more.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    We offer a 30-day money-back guarantee. If you&apos;re not satisfied, contact us for a full refund.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-blue-500 fill-blue-500" />
            <span className="text-xl font-bold text-white">Trustlet</span>
          </div>
          <p className="text-sm">
            Simple review collection and social proof for small businesses.
          </p>
          <p className="text-xs mt-4">
            © 2025 Trustlet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
