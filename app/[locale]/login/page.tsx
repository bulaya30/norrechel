import Header from "@/components/header/Header";
import LoginForm from "@/features/auth/components/LoginForm";

interface LoginPageProps {
  params: Promise<{
    locale: "en" | "fr";
  }>;
}

export default async function LoginPage({
  params,
}: LoginPageProps) {
  const { locale } = await params;

  return (
    <main id="main">
      <Header />
      <LoginForm locale={locale} />
    </main>
  );
}