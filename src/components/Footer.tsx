"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="text-center p-4 text-gray-400 text-sm bg-gray-900 border-t border-gray-800">
      <p>Fly Menú Digital &copy; {year}</p>
    </footer>
  );
}
