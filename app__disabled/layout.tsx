import '../styles/globals.css';

export const metadata = {
  title: 'Qrestro',
  description: 'Vendor & Customer dashboards',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
