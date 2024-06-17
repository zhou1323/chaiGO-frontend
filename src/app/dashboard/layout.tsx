import AuthGuard from '@/components/auth/auth-guard';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
