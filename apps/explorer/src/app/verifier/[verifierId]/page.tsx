import { VerifierPageContent } from './verifier-page-content';

interface VerifierPageProps {
  params: Promise<{
    verifierId: string;
  }>;
}

export default async function VerifierPage({ params }: VerifierPageProps) {
  const { verifierId } = await params;
  return <VerifierPageContent verifierId={verifierId} />;
}
