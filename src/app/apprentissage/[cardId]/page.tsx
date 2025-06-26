import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCardDetails } from "@/lib/data/cards";
import { notFound } from "next/navigation";
import { CardDetailsView } from "@/components/cards/card-details-view";

export default function CardDetailsPage({ params }: { params: { cardId: string } }) {
  const card = getCardDetails(params.cardId);

  // This check is now in a Server Component, which is more robust.
  if (!card) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {/* The interactive UI is now in its own Client Component */}
      <CardDetailsView card={card} />
      <Footer />
    </div>
  );
}
