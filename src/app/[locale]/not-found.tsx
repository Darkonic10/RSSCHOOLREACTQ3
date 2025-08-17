'use client';

import Link from 'next/link';

export default function page404() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 — Page not found</h1>
      <Link href="/">Return to the main</Link>
    </div>
  );
}
