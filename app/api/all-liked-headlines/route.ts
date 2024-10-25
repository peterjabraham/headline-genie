import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const allHeadlinesRef = collection(db, 'allLikedHeadlines');
    const snapshot = await getDocs(allHeadlinesRef);

    const headlines = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json(headlines);
  } catch (error) {
    console.error('Error fetching all liked headlines:', error);
    return NextResponse.json({ error: 'Failed to fetch headlines' }, { status: 500 });
  }
}