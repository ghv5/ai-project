import './globals.css';

export const metadata = {
  title: 'Car Portal Public',
  description: 'Automotive portal public site'
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
