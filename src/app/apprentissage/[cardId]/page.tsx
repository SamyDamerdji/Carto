import { notFound } from 'next/navigation';
import { getCardDetails } from '@/lib/data/cards';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CardDetailsView } from '@/components/cards/card-details-view';
import { CardNavigation } from '@/components/cards/card-navigation';

export default function CardDetailsPage({ params: { cardId } }: { params: { cardId: string } }) {
  const card = getCardDetails(cardId);

  if (!card) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <CardNavigation currentCardId={cardId} />
      <main className="flex-grow">
        <CardDetailsView card={card} />
      </main>
      <Footer />
    </div>
  );
}
