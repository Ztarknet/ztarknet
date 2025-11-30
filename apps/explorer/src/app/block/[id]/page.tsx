import { BlockPageContent } from './block-page-content';

interface BlockPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { id } = await params;
  return <BlockPageContent blockId={id} />;
}
