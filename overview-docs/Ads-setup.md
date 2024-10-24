# Ads Integration Setup Guide

## Tech Stack
- Next.js 14.0.0
- React 18.2.0
- TypeScript 5.0.4
- Google Publisher Tag (GPT) - Latest version
- @types/googletag 2.0.3

## Prerequisites
- Node.js (v18.17.0 or higher)
- npm (v9.6.7 or higher)
- A Google Ad Manager account with ad units configured

## Installation Steps

1. Create a new Next.js project (skip if adding to existing project):

bash
npx create-next-app@14.0.0 my-ad-project
cd my-ad-project


2. Install required dependencies:

bash
npm install @types/googletag@2.0.3


3. Create ad configuration file (`adConfig.ts`):

typescript
export const AD_UNITS = {
LEADERBOARD: '/your-network-code/leaderboard',
MEDIUM_RECTANGLE: '/your-network-code/medium-rectangle',
// Add more ad units as needed
};
export const AD_SIZES = {
LEADERBOARD: [728, 90],
MEDIUM_RECTANGLE: [300, 250],
// Add more sizes as needed
};


## Implementation Steps

1. Add Google Publisher Tag script to `app/layout.tsx`:

typescript
import Script from 'next/script';
export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<head>
<Script
id="gpt-script"
strategy="afterInteractive"
src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
/>
</head>
<body>{children}</body>
</html>
);
}

2. Create an Ad component (`components/Advertisement.tsx`):

typescript
'use client';
import { useEffect } from 'react';
import { AD_UNITS, AD_SIZES } from '../adConfig';
interface AdProps {
adUnit: keyof typeof AD_UNITS;
className?: string;
}
export default function Advertisement({ adUnit, className }: AdProps) {
useEffect(() => {
const slot = window.googletag
.defineSlot(AD_UNITS[adUnit], AD_SIZES[adUnit], ${adUnit}-ad)
?.addService(window.googletag.pubads());
window.googletag.cmd.push(() => {
window.googletag.enableServices();
window.googletag.display(${adUnit}-ad);
});
return () => {
window.googletag.cmd.push(() => {
slot && window.googletag.destroySlots([slot]);
});
};
}, [adUnit]);
return <div id={${adUnit}-ad} className={className} />;
}


## Usage Example

Add the Advertisement component to any page:

typescript
import Advertisement from '../components/Advertisement';
export default function HomePage() {
return (
<main>
<h1>Welcome to my site</h1>
<Advertisement adUnit="LEADERBOARD" />
<div>Your content here</div>
<Advertisement adUnit="MEDIUM_RECTANGLE" />
</main>
);
}


## Configuration Steps

1. Replace network codes in `adConfig.ts` with your actual Google Ad Manager network code
2. Configure ad units in Google Ad Manager that match your defined units
3. Test in development mode:

bash
npm run dev


## Best Practices

- Always implement ads with lazy loading for better performance
- Follow Google's policies regarding ad placement
- Test ad rendering across different devices and viewports
- Implement error boundaries around ad components
- Monitor ad performance using Google Ad Manager reporting

## Troubleshooting

Common issues and solutions:

1. Ads not displaying
   - Verify network code is correct
   - Check console for GPT errors
   - Ensure ad blocker is disabled for testing

2. Layout shifts
   - Pre-define ad container dimensions
   - Use CSS to reserve space for ads

3. Multiple ad refreshes
   - Verify cleanup function is working
   - Check for duplicate component mounting

## Additional Resources

- [Google Publisher Tag Reference](https://developers.google.com/publisher-tag/guides/get-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Ad Manager Help](https://support.google.com/admanager)


