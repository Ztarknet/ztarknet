import { AccountPageContent } from './account-page-content';

interface AccountPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { address } = await params;
  return <AccountPageContent address={address} />;
}
