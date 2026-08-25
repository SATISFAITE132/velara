import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Discounts GET error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('Discounts GET API error:', error);

    return NextResponse.json(
      { error: 'Could not load discounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('discounts')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Discounts POST error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discounts POST API error:', error);

    return NextResponse.json(
      { error: 'Could not create discount' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Discount id is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('discounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Discounts PATCH error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discounts PATCH API error:', error);

    return NextResponse.json(
      { error: 'Could not update discount' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Discount id is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('discounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Discounts DELETE error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discounts DELETE API error:', error);

    return NextResponse.json(
      { error: 'Could not delete discount' },
      { status: 500 }
    );
  }
}