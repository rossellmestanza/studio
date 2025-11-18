"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // This ensures the code runs only on the client, after hydration.
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="text-center p-4 text-muted-foreground text-sm">
      <p>Fly Menú Digital &copy; {year}</p>
    </footer>
  );
}
