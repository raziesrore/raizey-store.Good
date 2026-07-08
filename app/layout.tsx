import './globals.css';

export const metadata = {
  title: 'RAIZ3Y STORE | متجر رايزي',
  description: 'المنصة الرسمية لشحن الألعاب والخدمات الرقمية في السودان',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased selection:bg-[#FFB800] selection:text-black">
        {children}
      </body>
    </html>
  );
}
