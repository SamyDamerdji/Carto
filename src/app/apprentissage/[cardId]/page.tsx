import { notFound } from 'next/navigation';
import { getCardDetails } from '@/lib/data/cards';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CardDetailsView } from '@/components/cards/card-details-view';

export default function CardDetailsPage({ params }: { params: { cardId: string } }) {
  const card = getCardDetails(params.cardId);

  if (!card) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow">
        <CardDetailsView card={card} />
      </main>
      <Footer />
    </div>
  );
}
