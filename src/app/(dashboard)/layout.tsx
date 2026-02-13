import { redirect } from 'next/navigation';
import { getAuthToken } from '@/shared/auth/server';
import DashboardShell from './DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken();
  if (!token) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
