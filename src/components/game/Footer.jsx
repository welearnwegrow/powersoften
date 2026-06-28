import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-3 px-4 text-center space-y-1">
      <p className="text-xs text-muted-foreground">
        Based on the AstroEDU{' '}
        <a
          href="https://astroedu.iau.org/es/activities/2203/lets-play-with-powers-of-10/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Powers of Ten
        </a>{' '}
        card game by{' '}
        <a
          href="https://welearnwegrow.bio/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Jaya Ramchandani
        </a>{' '}
        • CC BY-NC-SA 4.0
      </p>
      <p className="text-xs flex items-center justify-center gap-3">
        <Link to="/about" className="text-primary hover:underline">About</Link>
        <span className="text-border">·</span>
        <Link to="/contact" className="text-primary hover:underline">Contact</Link>
      </p>
    </footer>
  );
}