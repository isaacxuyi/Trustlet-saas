import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({
        stats: {
          total_reviews: 0,
          average_rating: 0,
          published_reviews: 0,
          pending_reviews: 0,
          rating_distribution: {
            '5': 0,
            '4': 0,
            '3': 0,
            '2': 0,
            '1': 0,
          },
        },
      });
    }

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating, is_published')
      .eq('business_id', business.id);

    if (reviewsError) {
      console.error('Reviews fetch error:', reviewsError);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    const totalReviews = reviews.length;
    const publishedReviews = reviews.filter((r) => r.is_published).length;
    const pendingReviews = reviews.filter((r) => !r.is_published).length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
      '5': reviews.filter((r) => r.rating === 5).length,
      '4': reviews.filter((r) => r.rating === 4).length,
      '3': reviews.filter((r) => r.rating === 3).length,
      '2': reviews.filter((r) => r.rating === 2).length,
      '1': reviews.filter((r) => r.rating === 1).length,
    };

    return NextResponse.json({
      stats: {
        total_reviews: totalReviews,
        average_rating: Math.round(averageRating * 10) / 10,
        published_reviews: publishedReviews,
        pending_reviews: pendingReviews,
        rating_distribution: ratingDistribution,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
