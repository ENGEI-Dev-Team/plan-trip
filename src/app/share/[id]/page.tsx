import { PrintNavigationButton } from "@/components/atoms/PrintNavigationButton";

export default async function SharePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <header className="flex justify-between">
        <h1>旅のしおり</h1>
        <PrintNavigationButton itineraryId={params.id} />
      </header>
      {/* しおりの内容 */}
    </div>
  );
}
