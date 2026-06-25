import { CSSProperties } from 'react';
import { ElementType } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { JSX as JSX_2 } from 'react';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';

export declare type AccentColor = "teal" | "cyan" | "purple" | "orange";

/**
 * AccentIcon — the small rounded colour tiles pulze.io sets above section
 * headings (the product-icons row). A soft-tinted rounded square holding a
 * glyph in the accent colour.
 */
export declare function AccentIcon({ children, color, size, className }: AccentIconProps): JSX_2.Element;

export declare interface AccentIconProps {
    /** Glyph / emoji / SVG node. */
    children: ReactNode;
    /** Accent colour for the tile. */
    color?: AccentColor;
    /** Size in px. */
    size?: number;
    className?: string;
}

/**
 * Badge — pulze.io's small accent pill that labels each feature section
 * ("Create and enhance with AI"). A pill with a coloured dot + small label;
 * each product area gets its own accent colour.
 */
export declare function Badge({ children, color, solid, className }: BadgeProps): JSX_2.Element;

export declare interface BadgeProps {
    children: ReactNode;
    /** Accent colour — tints the dot and (subtly) the pill. */
    color?: AccentColor;
    /** Solid accent fill instead of the default soft tint. */
    solid?: boolean;
    className?: string;
}

/**
 * BlogCard — pulze.io's "Latest from Pulze" tile: a rounded media area, a
 * category Tag, a title and meta — the whole card a soft-shadowed link.
 * Composes Card + Tag + Text.
 */
export declare function BlogCard({ title, tag, meta, src, alt, color, href, className, }: BlogCardProps): JSX_2.Element;

export declare interface BlogCardProps {
    title: ReactNode;
    /** Category label. */
    tag?: ReactNode;
    /** Trailing meta (date / read time). */
    meta?: ReactNode;
    /** Image URL; falls back to an accent-tinted placeholder. */
    src?: string;
    alt?: string;
    /** Placeholder tint colour when no src. */
    color?: AccentColor;
    href?: string;
    className?: string;
}

/**
 * Button — pulze.io's pill action control (the teal "Contact" CTA, outline
 * secondaries). A pill with a medium-weight label; not built on Card because
 * it carries its own fill/hover semantics.
 */
export declare function Button({ children, variant, size, href, as, className, ...rest }: ButtonProps): JSX_2.Element;

export declare interface ButtonProps {
    children: ReactNode;
    /** "accent" filled (default), "ink" filled, or "outline". */
    variant?: "accent" | "ink" | "outline";
    /** Size. */
    size?: "md" | "sm";
    href?: string;
    as?: ElementType;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
}

/**
 * Card — the container primitive of pulze.io: a rounded surface, optionally
 * elevated by a soft shadow. Media frames, feature panels, blog tiles and
 * badges are all Cards with different tone / radius / elevation / content.
 */
export declare const Card: ForwardRefExoticComponent<Omit<CardProps, "ref"> & RefAttributes<HTMLElement>>;

export declare interface CardProps {
    children?: ReactNode;
    /** Surface fill. */
    tone?: "paper" | "cream" | "ink";
    /** Corner radius. */
    radius?: "sm" | "md" | "lg" | "pill";
    /** Drop-shadow elevation. */
    elevation?: "none" | "soft" | "lg";
    /** 1px hairline border. */
    bordered?: boolean;
    /** Inner padding in grid modules (10px each). */
    pad?: number;
    /** Hover lift (for clickable cards). */
    interactive?: boolean;
    /** Polymorphic tag — "div" (default), "a", "article", "button"… */
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

/**
 * FeatureRow — pulze.io's alternating product section: an accent Badge, a
 * heading and body on one side, a soft-shadowed media Card on the other.
 * Composes Badge + Text + Card.
 */
export declare function FeatureRow({ badge, color, title, children, media, reverse, className, }: FeatureRowProps): JSX_2.Element;

export declare interface FeatureRowProps {
    /** Accent badge label. */
    badge: ReactNode;
    /** Accent colour for the badge + media placeholder. */
    color?: AccentColor;
    /** Section title. */
    title: ReactNode;
    /** Body copy. */
    children?: ReactNode;
    /** Media slot (screenshot / image). Falls back to a tinted placeholder. */
    media?: ReactNode;
    /** Place media on the left instead of the right. */
    reverse?: boolean;
    className?: string;
}

/**
 * Heading — pulze.io's section heading: an optional accent Badge above a
 * semibold tightly-tracked display. Composes Badge + Text.
 */
export declare function Heading({ children, level, badge, badgeColor, center, as, className, }: HeadingProps): JSX_2.Element;

export declare interface HeadingProps {
    children: ReactNode;
    /** "hero" = oversized; "display" = section; "h" = sub. */
    level?: "hero" | "display" | "h";
    /** Optional accent badge above the heading. */
    badge?: ReactNode;
    /** Badge accent colour. */
    badgeColor?: AccentColor;
    /** Center-align heading + badge. */
    center?: boolean;
    as?: ElementType;
    className?: string;
}

/**
 * Tag — a small neutral category chip (the labels on blog cards). A bordered
 * pill wrapping a small label.
 */
export declare function Tag({ children, className }: TagProps): JSX_2.Element;

export declare interface TagProps {
    children: ReactNode;
    className?: string;
}

/**
 * Text — the typography primitive. Inter across the board with tight tracking
 * on large display sizes; an optional cursive `script` face for flourishes.
 */
declare const Text_2: ForwardRefExoticComponent<Omit<TextProps, "ref"> & RefAttributes<HTMLElement>>;
export { Text_2 as Text }

export declare interface TextProps {
    children?: ReactNode;
    /** Scale step. */
    size?: TextSize;
    /** Colour tone. */
    tone?: TextTone;
    /** Weight. */
    weight?: "regular" | "medium" | "semibold";
    /** Use the decorative script face (the Pulze flourish). */
    script?: boolean;
    /** Center-align. */
    center?: boolean;
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

export declare type TextSize = "hero" | "display" | "h" | "lead" | "body" | "small";

export declare type TextTone = "ink" | "muted" | "accent" | "inherit";

export { }
