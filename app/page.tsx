import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, MessageSquare, Code, Mail, TrendingUp, CircleCheck as CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Star className="h-7 w-7 text-blue-600 fill-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Trustlet</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Collect Reviews.<br />Build Trust.
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            The simple review collection and social proof tool for small businesses. Start collecting authentic customer reviews and showcase them beautifully on your website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Everything you need to collect and display reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Easy Review Collection</CardTitle>
                <CardDescription>
                  Share a simple link or send email requests to collect reviews from your customers effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Embeddable Widget</CardTitle>
                <CardDescription>
                  Display your reviews anywhere on your website with a beautiful, customizable widget. Just copy and paste.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Email Requests</CardTitle>
                <CardDescription>
                  Send review request emails directly from your dashboard. Make it easy for customers to leave feedback.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track your average rating, total reviews, and monitor customer feedback all in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Star Ratings</CardTitle>
                <CardDescription>
                  Beautiful 5-star rating system that your customers will love to use and prospects will trust.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>
                  Manage all your reviews from a single dashboard. Delete spam or inappropriate content easily.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to build trust with your customers?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start collecting reviews today and watch your business grow.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
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
