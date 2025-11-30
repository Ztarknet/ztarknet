import { TransactionPageContent } from './transaction-page-content';

interface TransactionPageProps {
  params: Promise<{
    txid: string;
  }>;
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { txid } = await params;
  return <TransactionPageContent txid={txid} />;
}
