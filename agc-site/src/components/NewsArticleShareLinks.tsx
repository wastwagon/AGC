import type { ReactNode } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";
import type { NewsSocialLinks } from "@/lib/news-downloads";

type NewsArticleShareLinksProps = {
  url: string;
  title: string;
  links?: NewsSocialLinks;
};

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function NewsArticleShareLinks({ url, title, links }: NewsArticleShareLinksProps) {
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const items: { href: string; label: string; node: ReactNode }[] = [
    {
      href: links?.facebook?.trim() || `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      label: "Share on Facebook",
      node: <IconFacebook className="h-[18px] w-[18px]" />,
    },
    {
      href: links?.x?.trim() || `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
      label: "Share on X",
      node: <IconX className="h-[17px] w-[17px]" />,
    },
    {
      href: links?.linkedin?.trim() || `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      label: "Share on LinkedIn",
      node: <Linkedin className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />,
    },
    {
      href: links?.instagram?.trim() || "https://instagram.com",
      label: "Open Instagram",
      node: <Instagram className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />,
    },
    {
      href: links?.email?.trim() || `mailto:?subject=${encTitle}&body=${encUrl}`,
      label: "Share by email",
      node: <Mail className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />,
    },
  ];

  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-white transition-colors hover:bg-accent-700"
          >
            {item.node}
          </a>
        </li>
      ))}
    </ul>
  );
}
