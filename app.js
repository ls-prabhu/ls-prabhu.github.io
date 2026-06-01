const h = React.createElement;

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDateShort(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

const githubDefaults = window.__GITHUB_PORTFOLIO_DATA__ || {
  totalLastYear: 267,
  repositories: 19,
  contributions: [],
  recentActivity: [
    {
      badge: "Star",
      title: "Starred vicinaehq/vicinae",
      meta: "May 31, 2026 · Public timeline",
      href: "https://github.com/vicinaehq/vicinae",
    },
    {
      badge: "Push",
      title: "Add Obsidian agent and onboarding UI for vault selection",
      meta: "May 30, 2026 · 1 commit · ls-prabhu/obsidian-rag",
      href: "https://github.com/ls-prabhu/obsidian-rag/commit/91f3473b3c0a592ac2c67c04f6090e86f66c4c89",
    },
    {
      badge: "Branch",
      title: "Created branch main",
      meta: "May 29, 2026 · ls-prabhu/obsidian-rag",
      href: "https://github.com/ls-prabhu/obsidian-rag",
    },
  ],
};

const githubContributionUrl =
  "https://github-contributions-api.jogruber.de/v4/ls-prabhu?y=last";
const githubProfileUrl = "https://api.github.com/users/ls-prabhu";
const githubEventsUrl = "https://api.github.com/users/ls-prabhu/events/public";
const rssUrl = "https://blog.prabhuls.me/rss.xml";
const corsProxy = "https://api.allorigins.win/raw?url=";
const corsTextProxy = "https://api.allorigins.win/get?url=";

async function fetchWithFallback(url) {
  const targets = [url, corsProxy + encodeURIComponent(url)];

  for (const target of targets) {
    try {
      const response = await fetch(target);
      if (!response.ok) {
        continue;
      }
      return response;
    } catch (error) {
      continue;
    }
  }

  throw new Error(`Unable to fetch ${url}`);
}

async function loadGitHubData() {
  try {
    const [contribResponse, eventsResponse] = await Promise.all([
      fetchWithFallback(githubContributionUrl),
      fetchWithFallback(githubEventsUrl),
    ]);

    const [contribJson, eventsJson] = await Promise.all([
      contribResponse.json(),
      eventsResponse.json(),
    ]);
    let repositories = githubDefaults.repositories;

    try {
      const profileResponse = await fetchWithFallback(githubProfileUrl);
      const profileJson = await profileResponse.json();
      repositories = Number(profileJson.public_repos ?? repositories);
    } catch (error) {
      repositories = githubDefaults.repositories;
    }

    const contributions = Array.isArray(contribJson.contributions)
      ? contribJson.contributions
      : [];
    const recentActivity = Array.isArray(eventsJson)
      ? eventsJson
          .map((event) => {
            if (event.type === "PushEvent") {
              const commit =
                event.payload?.commits?.at(-1)?.message || "Recent push";
              const commitCount = event.payload?.commits?.length || 0;
              return {
                badge: "Push",
                title: commit,
                meta: `${formatDateShort(event.created_at)} · ${commitCount} commit${commitCount === 1 ? "" : "s"} · ${event.repo?.name || ""}`,
                href: `https://github.com/${event.repo?.name}/commit/${event.payload?.head || ""}`,
              };
            }

            if (event.type === "WatchEvent") {
              return {
                badge: "Star",
                title: `Starred ${event.repo?.name || "repository"}`,
                meta: `${formatDateShort(event.created_at)} · Public timeline`,
                href: `https://github.com/${event.repo?.name || "ls-prabhu"}`,
              };
            }

            if (
              event.type === "CreateEvent" &&
              event.payload?.ref_type === "branch"
            ) {
              return {
                badge: "Branch",
                title: `Created branch ${event.payload?.ref || "main"}`,
                meta: `${formatDateShort(event.created_at)} · ${event.repo?.name || ""}`,
                href: `https://github.com/${event.repo?.name || "ls-prabhu"}`,
              };
            }

            return null;
          })
          .filter(Boolean)
          .slice(0, 3)
      : githubDefaults.recentActivity;

    return {
      totalLastYear: Number(
        contribJson.total?.lastYear ?? githubDefaults.totalLastYear,
      ),
      repositories,
      contributions,
      recentActivity: recentActivity.length
        ? recentActivity
        : githubDefaults.recentActivity,
    };
  } catch (error) {
    return githubDefaults;
  }
}

function parseRssItems(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const itemNodes = Array.from(xml.querySelectorAll("item"));
  const entryNodes = Array.from(xml.querySelectorAll("entry"));
  const nodes = itemNodes.length ? itemNodes : entryNodes;

  return nodes.map((node) => {
    const title =
      node.querySelector("title")?.textContent?.trim() || "Blog post";
    const href =
      node.querySelector("link")?.getAttribute("href") ||
      node.querySelector("link")?.textContent?.trim() ||
      "https://blog.prabhuls.me";
    const dateText =
      node.querySelector("pubDate")?.textContent?.trim() ||
      node.querySelector("updated")?.textContent?.trim() ||
      node.querySelector("published")?.textContent?.trim() ||
      "";
    const description =
      node.querySelector("description")?.textContent?.trim() ||
      node.querySelector("summary")?.textContent?.trim() ||
      node.querySelector("content")?.textContent?.trim() ||
      "";

    return {
      title,
      href,
      date: dateText ? formatDateShort(dateText) : "Recent",
      description: description
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180),
    };
  });
}

function badgeEmoji(badge) {
  const map = {
    Star: "⭐",
    Push: "⬆️",
    Branch: "🌿",
  };
  return map[badge] || "🔔";
}

function normalizeContributions(contribs) {
  if (!Array.isArray(contribs) || contribs.length === 0) return contribs;
  // Ensure chronological ascending order (oldest first)
  const arr = contribs.slice();
  const firstDate = new Date(arr[0].date);
  const lastDate = new Date(arr[arr.length - 1].date);
  if (firstDate > lastDate) arr.reverse();

  // Pad start so the first date falls on its weekday row (Sunday=0)
  const startWeekday = new Date(arr[0].date).getUTCDay();
  const prefix = Array.from({ length: startWeekday }).map(() => ({
    date: "",
    count: 0,
    level: 0,
  }));
  const combined = prefix.concat(arr);

  // Pad end so total length is a multiple of 7 (full weeks)
  const remainder = combined.length % 7;
  const suffix =
    remainder === 0
      ? []
      : Array.from({ length: 7 - remainder }).map(() => ({
          date: "",
          count: 0,
          level: 0,
        }));
  return combined.concat(suffix);
}

async function loadBlogPosts() {
  // For now return a small hardcoded set of posts to avoid RSS/CORS issues in development.
  return Promise.resolve(
    [
      {
        date: "14 May 2026",
        title: "A Better Way to Access Your Home Network",
        description:
          "How I set up secure remote access to my home network using DNS rewrites and self-hosted services — without exposing anything to the public internet.",
        href: "https://blog.prabhuls.me/way-to-access-your-home-network",
      },
      {
        date: "01 Dec 2025",
        title: "Beginner's Guide: Creating a Spring Boot REST API with Kotlin",
        description:
          "Step-by-step: build a production-ready REST API in Kotlin using Spring Boot — from project setup to database persistence and endpoint testing.",
        href: "https://blog.prabhuls.me/build-rest-api-with-kotlin-spring-boot",
      },
    ].slice(0, 3),
  );
}

const builderItems = [
  {
    title: "Health Tracker for Android",
    description:
      "A native Android app built with Jetpack Compose for logging and visualising daily health data. Designed around simplicity — no accounts, no cloud, no noise.",
    tags: ["Android", "Kotlin", "Jetpack Compose"],
    status: "In Development",
  },
  {
    title: "ServiceNow — Education Workflow System",
    description:
      "Built and delivered a ServiceNow implementation for an educational institution — covering student-facing request management, automated routing, and staff workflows.",
    tags: ["ServiceNow", "Automation", "Workflows"],
    status: "Delivered",
  },
  {
    title: "Document AI — RAG Agent with Google ADK",
    description:
      "An AI-powered document Q&A system built with Google's Agent Development Kit. Ask questions over your own files and get grounded, cited answers — no hallucinations.",
    tags: ["AI", "RAG", "Google ADK"],
    status: "In Progress",
  },
];

const skillGroups = [
  {
    label: "Android Mobile",
    skills: ["Android", "Kotlin", "Jetpack Compose"],
  },
  { label: "Backend & Data", skills: ["Python", "Spring Boot", "PostgreSQL"] },
  { label: "AI & Retrieval", skills: ["RAG", "Google ADK"] },
  {
    label: "Automation & APIs",
    skills: ["REST APIs", "n8n", "Automation"],
  },
];

const education = [
  {
    title: "B.Sc. Computer Science",
    meta: "AM Jain College · Chennai · In progress",
    details:
      "Core focus: software systems, algorithms, and applied development. Running real projects in parallel with coursework.",
  },
];

const contactLinks = [
  {
    label: "GitHub",
    value: "github.com/ls-prabhu",
    href: "https://github.com/ls-prabhu",
    cta: "View Profile",
  },
  {
    label: "Blog",
    value: "blog.prabhuls.me",
    href: "https://blog.prabhuls.me",
    cta: "Read Blog",
  },
  {
    label: "Email",
    value: "dev@prabhuls.me",
    href: "mailto:dev@prabhuls.me",
    cta: "Send Email",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/prabhu-ls",
    href: "https://linkedin.com/in/prabhu-ls",
    cta: "Connect",
  },
];

function App() {
  const [githubData, setGithubData] = React.useState(githubDefaults);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      const [github, blog] = await Promise.all([
        loadGitHubData(),
        loadBlogPosts(),
      ]);
      if (cancelled) {
        return;
      }
      setGithubData(github);
      setPosts(blog);
      setLoading(false);
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeDays = githubData.contributions.filter(
    (day) => day.count > 0,
  ).length;
  const activityCells = githubData.contributions.length
    ? normalizeContributions(githubData.contributions)
    : Array.from({ length: 53 * 7 }).map((_, index) => ({
        date: `placeholder-${index}`,
        count: 0,
        level: 0,
      }));

  const githubStats = [
    {
      label: "Contributions this year",
      value: formatNumber(githubData.totalLastYear),
    },
    { label: "Public repos", value: formatNumber(githubData.repositories) },
    { label: "Days active", value: formatNumber(activeDays || 0) },
  ];

  return h(
    "div",
    { className: "shell" },
    h(
      "header",
      { className: "topbar" },
      h(
        "div",
        { className: "container topbar-inner" },
        h(
          "a",
          { href: "#top", className: "brand" },
          h("span", { className: "brand-mark", "aria-hidden": "true" }),
          h("span", null, "Prabhu LS"),
        ),
        h(
          "nav",
          { className: "nav", "aria-label": "Primary" },
          h("a", { href: "#activity" }, "Activity"),
          h("a", { href: "#building" }, "Projects"),
          h("a", { href: "#skills" }, "Skills"),
          h("a", { href: "#education" }, "Education"),
          h("a", { href: "#latest-posts" }, "Writing"),
          h("a", { href: "#contact" }, "Contact"),
        ),
      ),
    ),
    h(
      "main",
      { id: "top" },
      h(
        "div",
        { className: "container" },
        h(
          "section",
          { className: "hero fade-in" },
          h(
            "div",
            { className: "hero-grid" },
            h(
              "div",
              { className: "hero-panel" },
              h(
                "div",
                { className: "eyebrow" },
                "Developer · Chennai, India",
              ),
              h("h1", null, "Prabhu LS"),
              h(
                "p",
                { className: "hero-copy" },
                "I build Android apps, backend systems, and AI-powered tools that are useful, private by design, and made to last. Currently pursuing B.Sc. Computer Science while shipping real projects.",
              ),
              h(
                "div",
                { className: "hero-actions" },
                h(
                  "a",
                  { className: "button button-primary", href: "#contact" },
                  "Get in Touch",
                ),
                h(
                  "a",
                  {
                    className: "button button-secondary",
                    href: "#latest-posts",
                  },
                  "Read the Blog",
                ),
              ),
            ),
            h(
              "aside",
              { className: "hero-side" },
              h(
                "div",
                { className: "panel stats-card" },
                h("div", { className: "mini-title" }, "GitHub Activity"),
                h(
                  "div",
                  { className: "stats-grid" },
                  githubStats.map((stat) =>
                    h(
                      "div",
                      { className: "stat", key: stat.label },
                      h("span", { className: "stat-label" }, stat.label),
                      h("span", { className: "stat-value" }, stat.value),
                    ),
                  ),
                ),
                h(
                  "p",
                  { className: "stats-note" },
                  loading
                    ? "Loading live data from GitHub…"
                    : "Live data pulled from GitHub — updated on every visit.",
                ),
              ),
              h(
                "div",
                { className: "panel mini-panel" },
                h("div", { className: "mini-title" }, "Latest Commits"),
                h(
                  "div",
                  { className: "activity-feed" },
                  githubData.recentActivity.map((item) =>
                    h(
                      "a",
                      {
                        className: "activity-item",
                        href: item.href,
                        target: "_blank",
                        rel: "noreferrer",
                        key: item.title,
                      },
                      h(
                        "span",
                        { className: "activity-badge" },
                        badgeEmoji(item.badge),
                      ),
                      h(
                        "span",
                        null,
                        h(
                          "div",
                          { className: "activity-item-title" },
                          item.title,
                        ),
                        h(
                          "div",
                          { className: "activity-item-meta" },
                          item.meta,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),

        h(
          "section",
          { id: "activity", className: "fade-in" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title" }, "Shipping Consistently"),
              h(
                "p",
                { className: "section-caption" },
                "Every green square is a real commit. Here's what the last year looks like.",
              ),
            ),
          ),
          h(
            "div",
            { className: "panel activity-panel" },
            h(
              "div",
              { className: "activity-layout" },
              h(
                "div",
                { className: "activity-graph-col" },
                h(
                  "div",
                  { className: "activity-summary" },
                  h(
                    "div",
                    null,
                    h(
                      "div",
                      {
                        className: "section-title",
                        style: { fontSize: "1.02rem" },
                      },
                      "Contribution heatmap — last 12 months",
                    ),
                    h(
                      "div",
                      { className: "activity-count" },
                      `${formatNumber(githubData.totalLastYear)} contributions in the last year`,
                    ),
                  ),
                  h(
                    "div",
                    { className: "legend" },
                    h("span", null, "Less"),
                    h("span", {
                      className: "legend-swatch lowest",
                      "aria-hidden": "true",
                    }),
                    h("span", {
                      className: "legend-swatch low",
                      "aria-hidden": "true",
                    }),
                    h("span", {
                      className: "legend-swatch mid",
                      "aria-hidden": "true",
                    }),
                    h("span", {
                      className: "legend-swatch high",
                      "aria-hidden": "true",
                    }),
                    h("span", {
                      className: "legend-swatch highest",
                      "aria-hidden": "true",
                    }),
                    h("span", null, "More"),
                  ),
                ),
                h(
                  "div",
                  { className: "activity-grid-scroll" },
                  h(
                    "div",
                    {
                      className: "activity-grid",
                      "aria-label": "GitHub contribution graph",
                    },
                    activityCells.map((day, index) => {
                      const level = day.level || 0;
                      const className =
                        level >= 4
                          ? "day level-4"
                          : level === 3
                            ? "day level-3"
                            : level === 2
                              ? "day level-2"
                              : level === 1
                                ? "day level-1"
                                : "day";
                      return h("span", {
                        key: day.date || index,
                        className,
                        title: day.count
                          ? `${day.count} contributions on ${day.date}`
                          : "No contributions",
                      });
                    }),
                  ),
                ),
              ),
              h(
                "div",
                { className: "activity-feed" },
                githubData.recentActivity.map((item) =>
                  h(
                    "a",
                    {
                      className: "activity-item",
                      href: item.href,
                      target: "_blank",
                      rel: "noreferrer",
                      key: item.title,
                    },
                    h(
                      "span",
                      { className: "activity-badge" },
                      badgeEmoji(item.badge),
                    ),
                    h(
                      "span",
                      null,
                      h(
                        "div",
                        { className: "activity-item-title" },
                        item.title,
                      ),
                      h("div", { className: "activity-item-meta" }, item.meta),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),

        h(
          "section",
          { id: "building", className: "fade-in" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title" }, "Projects"),
              h(
                "p",
                { className: "section-caption" },
                "A focused set of real projects — one shipped, two actively in progress.",
              ),
            ),
          ),
          h(
            "div",
            { className: "builder-grid" },
            builderItems.map((item) =>
              h(
                "article",
                { className: "card", key: item.title },
                h("h3", { className: "card-title" }, item.title),
                h("div", { className: "status" }, item.status),
                h("p", { className: "card-desc" }, item.description),
                h(
                  "div",
                  { className: "tag-row" },
                  item.tags.map((tag) =>
                    h("span", { className: "tag", key: tag }, tag),
                  ),
                ),
              ),
            ),
          ),
        ),

        h(
          "section",
          { id: "skills", className: "fade-in" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title" }, "Skills & Stack"),
              h(
                "p",
                { className: "section-caption" },
                "Tools I use daily and reach for when they're the right fit.",
              ),
            ),
          ),
          h(
            "div",
            { className: "skills-grid" },
            skillGroups.map((group) =>
              h(
                "div",
                { className: "panel skills-card", key: group.label },
                h("div", { className: "skills-label" }, group.label),
                h(
                  "div",
                  { className: "skills-list" },
                  group.skills.map((skill) =>
                    h("span", { className: "tag", key: skill }, skill),
                  ),
                ),
              ),
            ),
          ),
        ),

        h(
          "section",
          { id: "education", className: "fade-in" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title" }, "Education"),
              h(
                "p",
                { className: "section-caption" },
                "Building the theoretical foundation alongside real-world projects.",
              ),
            ),
          ),
          h(
            "div",
            { className: "timeline" },
            education.map((item) =>
              h(
                "div",
                { className: "timeline-item", key: item.title },
                h("span", { className: "timeline-dot", "aria-hidden": "true" }),
                h(
                  "div",
                  null,
                  h("h3", { className: "timeline-title" }, item.title),
                  h("div", { className: "timeline-meta" }, item.meta),
                  h("p", { className: "timeline-meta" }, item.details),
                ),
              ),
            ),
          ),
        ),

        h(
          "section",
          { id: "latest-posts", className: "fade-in" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title" }, "Writing"),
              h(
                "p",
                { className: "section-caption" },
                "Practical guides and notes from things I've built, broken, and fixed.",
              ),
            ),
            h(
              "a",
              {
                className: "subtle-link",
                href: "https://blog.prabhuls.me",
                target: "_blank",
                rel: "noreferrer",
              },
              "Read all articles →",
            ),
          ),
          h(
            "div",
            { className: "posts-grid" },
            posts.map((post) =>
              h(
                "a",
                {
                  className: "panel post-card",
                  key: post.title,
                  href: post.href,
                  target: "_blank",
                  rel: "noreferrer",
                },
                h(
                  "div",
                  { className: "post-meta" },
                  h("span", null, "Article"),
                  h("span", null, post.date),
                ),
                h("h3", { className: "post-title" }, post.title),
                h("p", { className: "post-desc" }, post.description),
              ),
            ),
          ),
        ),

        h(
          "footer",
          { id: "contact", className: "footer fade-in" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title" }, "Let's Connect"),
              h(
                "p",
                { className: "section-caption" },
                "Open to collaboration, project work, and interesting conversations.",
              ),
            ),
          ),
          h(
            "div",
            { className: "contact-grid" },
            contactLinks.map((link) =>
              h(
                "a",
                {
                  className: "panel contact-card",
                  key: link.label,
                  href: link.href,
                },
                h(
                  "div",
                  null,
                  h("div", { className: "contact-label" }, link.label),
                  h("span", { className: "contact-value" }, link.value),
                ),
                h("span", { className: "subtle-link" }, link.cta),
              ),
            ),
          ),
          h(
            "p",
            { className: "closing" },
            "Built with React — no bundlers, no frameworks. © 2026 Prabhu LS.",
          ),
        ),
      ),
    ),
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App, null));
