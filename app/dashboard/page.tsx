'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { BusinessSetupDialog } from '@/components/BusinessSetupDialog';
import {
  Star,
  MessageSquare,
  ExternalLink,
  Plus,
  LogOut,
  Building,
  CreditCard,
  Edit,
  Copy,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react';

type Business = {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
};

type Subscription = {
  plan: 'free' | 'paid';
  status: string;
  created_at: string;
};

type ReviewStats = {
  total_reviews: number;
  average_rating: number;
  published_reviews: number;
  pending_reviews: number;
  rating_distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
};

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_published: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [business, setBusiness] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        throw new Error('No access token');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [businessRes, subscriptionRes, statsRes, reviewsRes] = await Promise.all([
        fetch('/api/business-info', { headers }),
        fetch('/api/subscription', { headers }),
        fetch('/api/review-stats', { headers }),
        fetch('/api/recent-reviews?limit=10', { headers }),
      ]);

      const [businessData, subscriptionData, statsData, reviewsData] = await Promise.all([
        businessRes.json(),
        subscriptionRes.json(),
        statsRes.json(),
        reviewsRes.json(),
      ]);

      setBusiness(businessData.business);
      setSubscription(subscriptionData.subscription);
      setStats(statsData.stats);
      setReviews(reviewsData.reviews);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  function handleCopyLink() {
    if (!business) return;
    const reviewFormUrl = `${window.location.origin}/review/${business.id}`;
    navigator.clipboard.writeText(reviewFormUrl);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Review form link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const reviewFormUrl = business
    ? `${window.location.origin}/review/${business.id}`
    : '';

  const isFreePlan = subscription?.plan === 'free';
  const canCollectMoreReviews = !isFreePlan || (stats?.total_reviews || 0) < 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Trustlet
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Here&apos;s how your review collection is performing
          </p>
        </div>

        {!business && (
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Get Started with Your Business
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Set up your business profile to start collecting and displaying customer reviews
                  </p>
                  <Button onClick={() => setBusinessDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Up Business
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Reviews
              </CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats?.total_reviews || 0}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                {stats?.published_reviews || 0} published
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Average Rating
              </CardTitle>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stats?.average_rating?.toFixed(1) || '0.0'}
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(stats?.average_rating || 0)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Current Plan
              </CardTitle>
              <div className="bg-purple-100 p-2 rounded-lg">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 capitalize mb-1">
                {subscription?.plan || 'Free'}
              </div>
              <Badge
                variant={subscription?.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {subscription?.status || 'Active'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                This Month
              </CardTitle>
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {reviews.filter(r => {
                  const reviewDate = new Date(r.created_at);
                  const now = new Date();
                  return reviewDate.getMonth() === now.getMonth() &&
                         reviewDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-slate-500">New reviews</p>
            </CardContent>
          </Card>
        </div>

        {!canCollectMoreReviews && (
          <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 p-3 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    You&apos;ve reached your review limit
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Upgrade to the paid plan to collect unlimited reviews and unlock premium features
                  </p>
                  <Link href="/pricing">
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Business Information</CardTitle>
                  <CardDescription>
                    Your profile and review collection settings
                  </CardDescription>
                </div>
                {business && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBusinessDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {business ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Building className="h-4 w-4 text-slate-400" />
                        Business Name
                      </label>
                      <p className="text-slate-900 font-medium">{business.name}</p>
                    </div>
                    {business.website && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-slate-400" />
                          Website
                        </label>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          {business.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-slate-400" />
                      Review Collection Link
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-slate-100 px-4 py-3 rounded-lg flex-1 truncate border border-slate-200 font-mono">
                        {reviewFormUrl}
                      </code>
                      <Button
                        size="sm"
                        onClick={handleCopyLink}
                        className="shrink-0"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Share this link with customers to collect reviews
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No business profile yet
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                    Create your business profile to start collecting customer reviews
                  </p>
                  <Button onClick={() => setBusinessDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Up Business
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Rating Distribution</CardTitle>
              <CardDescription>Breakdown by star rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats?.rating_distribution?.[rating.toString() as '5' | '4' | '3' | '2' | '1'] || 0;
                  const percentage = stats?.total_reviews
                    ? (count / stats.total_reviews) * 100
                    : 0;

                  return (
                    <div key={rating} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium text-slate-700">
                            {rating}
                          </span>
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-10 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {stats && stats.total_reviews > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Reviews</span>
                    <span className="font-bold text-slate-900">{stats.total_reviews}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </div>
              {reviews.length > 0 && stats?.pending_reviews! > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {stats?.pending_reviews} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg mb-1">
                          {review.customer_name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={review.is_published ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {review.is_published ? 'Published' : 'Pending'}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Share your review form link with customers to start collecting feedback
                </p>
                {business && (
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Review Link
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BusinessSetupDialog
        open={businessDialogOpen}
        onOpenChange={setBusinessDialogOpen}
        business={business}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
