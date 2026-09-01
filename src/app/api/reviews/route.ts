
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const productId = String(body.productId ?? '').trim();
    const author = String(body.author ?? '').trim();
    const title = String(body.title ?? '').trim();
    const reviewBody = String(body.body ?? '').trim();
    const rating = Number(body.rating);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product is required.' },
        { status: 400 }
      );
    }

    if (!author) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!reviewBody) {
      return NextResponse.json(
        { error: 'Review is required.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }

    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
  product_id: productId,
  author,
  email: body.email ? String(body.email).trim() : null,
  rating,
  title: title || null,
  body: reviewBody,
  verified: false,
  approved: false,
})
      .select()
      .single();

    if (reviewError) {
      console.error('Review insert error:', reviewError.message);

      return NextResponse.json(
        { error: 'Could not submit review.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Review API error:', error);

    return NextResponse.json(
      { error: 'Could not submit review.' },
      { status: 500 }
    );
  }
}

