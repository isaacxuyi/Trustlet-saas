'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  ExternalLink,
  Plus,
  LogOut,
  Building,
  CreditCard
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
              <span className="text-xl font-bold text-slate-900">Trustlet Dashboard</span>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-slate-600">
            Here&apos;s an overview of your review collection activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.total_reviews || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats?.published_reviews || 0} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.average_rating?.toFixed(1) || '0.0'}
              </div>
              <div className="flex items-center mt-1">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Current Plan
              </CardTitle>
              <CreditCard className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 capitalize">
                {subscription?.plan || 'Free'}
              </div>
              <Badge
                variant={subscription?.status === 'active' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {subscription?.status || 'Active'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Business
              </CardTitle>
              <Building className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-slate-900 truncate">
                {business?.name || 'Not set up'}
              </div>
              {business && !business.name && (
                <Button variant="link" className="p-0 h-auto mt-1" size="sm">
                  Set up now
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Your business profile and review collection settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {business ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Business Name</label>
                    <p className="text-slate-900 mt-1">{business.name}</p>
                  </div>
                  {business.website && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">Website</label>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center mt-1"
                      >
                        {business.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-slate-700">Review Form Link</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-slate-100 px-3 py-2 rounded flex-1 truncate">
                        {reviewFormUrl}
                      </code>
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(reviewFormUrl);
                          toast({
                            title: 'Copied!',
                            description: 'Review form link copied to clipboard',
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Set up your business
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Create your business profile to start collecting reviews
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Breakdown by star rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats?.rating_distribution?.[rating.toString() as '5' | '4' | '3' | '2' | '1'] || 0;
                  const percentage = stats?.total_reviews
                    ? (count / stats.total_reviews) * 100
                    : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 w-6">
                        {rating}
                      </span>
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {review.customer_name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={review.is_published ? 'default' : 'secondary'}>
                          {review.is_published ? 'Published' : 'Pending'}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-slate-600 mb-4">
                  Share your review form link to start collecting feedback
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
