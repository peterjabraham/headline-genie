import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userHeadlinesRef = collection(db, 'userLikedHeadlines');
    const userQuery = query(userHeadlinesRef, where('userId', '==', session.user.email));
    const snapshot = await getDocs(userQuery);
    
    const headlines = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json(headlines);
  } catch (error) {
    console.error('Error fetching liked headlines:', error);
    return NextResponse.json({ error: 'Failed to fetch headlines' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { headline, primaryText, userId, userEmail } = await req.json();
    const timestamp = new Date().toISOString();

    // Save to user's personal collection
    await addDoc(collection(db, 'userLikedHeadlines'), {
      headline,
      primaryText,
      userId,
      timestamp,
    });

    // Save to all headlines collection
    await addDoc(collection(db, 'allLikedHeadlines'), {
      headline,
      primaryText,
      userId,
      userEmail,
      timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving liked headline:', error);
    return NextResponse.json({ error: 'Failed to save headline' }, { status: 500 });
  }
}
