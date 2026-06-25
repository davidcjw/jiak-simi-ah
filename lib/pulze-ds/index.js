import { jsx as n, jsxs as d } from "react/jsx-runtime";
import { forwardRef as _ } from "react";
const b = _(function({
  children: e,
  tone: a = "paper",
  radius: t = "md",
  elevation: l = "none",
  bordered: o = !1,
  pad: i,
  interactive: r = !1,
  as: p,
  className: u = "",
  style: m,
  ...z
}, f) {
  const g = p ?? "div", $ = [
    "pz-card",
    `pz-card--${a}`,
    `pz-card--r-${t}`,
    `pz-card--e-${l}`,
    o && "pz-card--bordered",
    r && "pz-card--interactive",
    u
  ].filter(Boolean).join(" "), h = { ...m ?? {} };
  return i != null && (h["--pz-card-pad"] = `calc(${i} * var(--pz-module))`), /* @__PURE__ */ n(g, { ref: f, className: $, style: h, ...z, children: e });
}), x = {
  hero: "h1",
  display: "h2",
  h: "h3",
  lead: "p",
  body: "p",
  small: "span"
}, c = _(function({
  children: e,
  size: a = "body",
  tone: t = "ink",
  weight: l = "regular",
  script: o = !1,
  center: i = !1,
  as: r,
  className: p = "",
  style: u,
  ...m
}, z) {
  const f = r ?? x[a], g = [
    "pz-text",
    `pz-text--${a}`,
    `pz-text--${t}`,
    `pz-text--w-${l}`,
    o && "pz-text--script",
    i && "pz-text--center",
    p
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(f, { ref: z, className: g, style: u, ...m, children: e });
});
function B({
  children: s,
  variant: e = "accent",
  size: a = "md",
  href: t,
  as: l,
  className: o = "",
  ...i
}) {
  const r = l ?? (t ? "a" : "button"), p = [
    "pz-button",
    `pz-button--${e}`,
    `pz-button--${a}`,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(r, { className: p, ...t ? { href: t } : {}, ...i, children: s });
}
function N({ children: s, color: e = "teal", solid: a = !1, className: t = "" }) {
  const l = [
    "pz-badge",
    `pz-badge--${e}`,
    a && "pz-badge--solid",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d("span", { className: l, children: [
    /* @__PURE__ */ n("span", { className: "pz-badge__dot", "aria-hidden": "true" }),
    /* @__PURE__ */ n(c, { as: "span", size: "small", weight: "medium", tone: a ? "inherit" : "ink", children: s })
  ] });
}
function w({
  children: s,
  level: e = "display",
  badge: a,
  badgeColor: t = "teal",
  center: l = !1,
  as: o,
  className: i = ""
}) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: ["pz-heading", i].filter(Boolean).join(" "),
      style: {
        display: "grid",
        gap: 16,
        justifyItems: l ? "center" : "start",
        textAlign: l ? "center" : "start"
      },
      children: [
        a != null && /* @__PURE__ */ n(N, { color: t, children: a }),
        /* @__PURE__ */ n(c, { size: e, weight: "semibold", as: o, center: l, children: s })
      ]
    }
  );
}
function y({ children: s, className: e = "" }) {
  return /* @__PURE__ */ n("span", { className: ["pz-tag", e].filter(Boolean).join(" "), children: /* @__PURE__ */ n(c, { as: "span", size: "small", weight: "medium", tone: "muted", children: s }) });
}
function T({ children: s, color: e = "teal", size: a = 40, className: t = "" }) {
  const l = { "--pz-icon-size": `${a}px` };
  return /* @__PURE__ */ n(
    "span",
    {
      className: ["pz-accent-icon", `pz-accent-icon--${e}`, t].filter(Boolean).join(" "),
      style: l,
      "aria-hidden": "true",
      children: s
    }
  );
}
function A({
  badge: s,
  color: e = "teal",
  title: a,
  children: t,
  media: l,
  reverse: o = !1,
  className: i = ""
}) {
  return /* @__PURE__ */ d("div", { className: ["pz-feature", o && "pz-feature--reverse", i].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ d("div", { className: "pz-feature__copy", children: [
      /* @__PURE__ */ n(N, { color: e, children: s }),
      /* @__PURE__ */ n(c, { size: "h", weight: "semibold", className: "pz-feature__title", children: a }),
      t != null && /* @__PURE__ */ n(c, { size: "lead", tone: "muted", className: "pz-feature__body", children: t })
    ] }),
    /* @__PURE__ */ n(b, { tone: "cream", radius: "lg", elevation: "soft", className: `pz-feature__media pz-feature__media--${e}`, children: l })
  ] });
}
function C({
  title: s,
  tag: e,
  meta: a,
  src: t,
  alt: l = "",
  color: o = "teal",
  href: i,
  className: r = ""
}) {
  return /* @__PURE__ */ d(
    b,
    {
      as: i ? "a" : "article",
      href: i,
      tone: "paper",
      radius: "lg",
      elevation: "soft",
      interactive: i != null,
      className: ["pz-blog", r].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ n("div", { className: `pz-blog__media pz-blog__media--${o}`, children: t ? /* @__PURE__ */ n("img", { src: t, alt: l }) : null }),
        /* @__PURE__ */ d("div", { className: "pz-blog__body", children: [
          e != null && /* @__PURE__ */ n(y, { children: e }),
          /* @__PURE__ */ n(c, { size: "lead", weight: "semibold", className: "pz-blog__title", children: s }),
          a != null && /* @__PURE__ */ n(c, { size: "small", tone: "muted", children: a })
        ] })
      ]
    }
  );
}
export {
  T as AccentIcon,
  N as Badge,
  C as BlogCard,
  B as Button,
  b as Card,
  A as FeatureRow,
  w as Heading,
  y as Tag,
  c as Text
};
