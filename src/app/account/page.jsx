import AccountPage from "@/components/account/account-page";
import AuthGuard from "@/components/wrapper/AuthGuard";
import { SEO_CONFIG } from "@/lib/seo";

export const metadata = {
  title: SEO_CONFIG.pages.account.title,
  description: SEO_CONFIG.pages.account.description,
  keywords: [
    "my account",
    "booking history",
    "profile management",
    "travel preferences",
    "account settings",
    "user dashboard",
    "SmallBus account",
  ],
  openGraph: {
    title: SEO_CONFIG.pages.account.title,
    description: SEO_CONFIG.pages.account.description,
    url: `${SEO_CONFIG.siteUrl}/account`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Account() {
  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <AccountPage />
    </AuthGuard>
  );
}
