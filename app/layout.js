//run with "npm run dev"
//To opt out of Telemetry: https://nextjs.org/telemetry
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}