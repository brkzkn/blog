// Single source of truth for site identity, contact, social links and analytics.
// Pages and components read from here; nothing else hard-codes a profile URL or the contact address.

export interface Social {
  id: 'linkedin' | 'github' | 'instagram';
  label: string;
  href: string;
  /** Shown text for contact panels, without the scheme. */
  display: string;
  /** false = not rendered anywhere. Flip to true to show it again (Instagram is private for now). */
  enabled: boolean;
}

export const site = {
  name: 'Burak Özkan',
  url: 'https://burakozkan.net',
  // Public contact address. It is a Cloudflare Email Routing alias; the destination mailbox is never stored in this repo.
  email: 'hello@burakozkan.net',
  socials: [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/brkzkn', display: 'linkedin.com/in/brkzkn', enabled: true },
    { id: 'github', label: 'GitHub', href: 'https://github.com/brkzkn', display: 'github.com/brkzkn', enabled: true },
    // Account is private at the moment, so the link would lead to a dead end. Set enabled: true once it is public.
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/brkzkn', display: 'instagram.com/brkzkn', enabled: false },
  ] as Social[],
  analytics: {
    // Cloudflare Web Analytics beacon token for burakozkan.net (public by design: it is visible in every page's HTML).
    // PUBLIC_CF_ANALYTICS_TOKEN overrides it at build time.
    cloudflareToken: String(import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN ?? '551e9d5004504fe09ffc5b461ca85b26').trim(),
  },
};

// Coming-soon mode: `/` shows a short holding page, every other page is noindex and the real home is at /preview/.
// Off unless PUBLIC_COMING_SOON is 'true' (deploy.yml), so local development shows the real site.
export const comingSoon = String(import.meta.env.PUBLIC_COMING_SOON ?? '') === 'true';

export const enabledSocials = site.socials.filter((s) => s.enabled);
export const social = (id: Social['id']): Social | undefined => site.socials.find((s) => s.id === id && s.enabled);
export const analyticsEnabled = import.meta.env.PROD && site.analytics.cloudflareToken !== '';
