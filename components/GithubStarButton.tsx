import { Button } from "@/lib/pulze-ds";

const REPO = "https://github.com/davidcjw/jiak-simi-ah";

function GithubMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function GithubStarButton() {
  return (
    <Button
      as="a"
      href={REPO}
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="sm"
      aria-label="Star Jiak Simi Ah on GitHub"
      className="group !gap-2"
    >
      <GithubMark style={{ width: 16, height: 16 }} />
      <span>Star on GitHub</span>
      <StarIcon
        style={{ width: 14, height: 14, color: "var(--pz-orange)" }}
        className="transition-transform duration-200 group-hover:scale-125"
      />
    </Button>
  );
}
