import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocalizedArticle, type ArticleSection } from '../lib/articles';
import { useLang } from '../store/langContext';
import { trackArticleOpened } from '../lib/analytics';

function renderSection(section: ArticleSection, i: number) {
  switch (section.type) {
    case 'h2':
      return (
        <h2 key={i} className="text-base font-semibold text-[#f0ede4] mt-6 mb-2">
          {section.text}
        </h2>
      );
    case 'p':
      return (
        <p key={i} className="text-sm text-[#c8c4b0] leading-relaxed">
          {section.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="space-y-1.5 pl-1">
          {section.items.map((item, j) => (
            <li key={j} className="text-sm text-[#c8c4b0] leading-relaxed flex gap-2">
              <span className="text-[#7cb87a] mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'formula':
      return (
        <div key={i} className="rounded-xl bg-[#2e2e22] border border-[#3a3a2a] p-4 space-y-1.5">
          <p className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{section.label}</p>
          <p className="text-sm font-mono text-[#d4a24c] leading-relaxed whitespace-pre">{section.formula}</p>
          {section.note && (
            <p className="text-xs text-[#9a9680] italic">{section.note}</p>
          )}
        </div>
      );
    case 'table':
      return (
        <div key={i} className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {section.headers.map((h, j) => (
                  <th
                    key={j}
                    className="text-left text-xs font-semibold text-[#9a9680] uppercase tracking-wide pb-2 pr-4 border-b border-[#3a3a2a]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, j) => (
                <tr key={j} className="border-b border-[#3a3a2a]/50 last:border-0">
                  {row.map((cell, k) => (
                    <td key={k} className="text-[#c8c4b0] py-2.5 pr-4 align-top leading-relaxed">
                      {k === 0 ? <span className="font-medium">{cell}</span> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div key={i} className="rounded-xl bg-[#7cb87a]/10 border border-[#7cb87a]/25 p-4">
          <p className="text-sm text-[#c8c4b0] leading-relaxed">{section.text}</p>
        </div>
      );
    case 'stat-row':
      return (
        <div key={i} className="grid grid-cols-3 gap-2 rounded-xl bg-[#2e2e22] border border-[#3a3a2a] p-3">
          {section.stats.map((stat, j) => (
            <div key={j} className="text-center px-1">
              <p className="text-base font-bold text-[#d4a24c] leading-tight">{stat.value}</p>
              <p className="text-[10px] text-[#9a9680] leading-snug mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      );
    case 'visual-bar':
      return (
        <div key={i} className="rounded-xl bg-[#2e2e22] border border-[#3a3a2a] p-4 space-y-3">
          {section.bars.map((bar, j) => {
            const pct = bar.max > 0 ? Math.min(100, (bar.value / bar.max) * 100) : 0;
            return (
              <div key={j} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#c8c4b0]">{bar.label}</span>
                  {bar.suffix && <span className="text-xs font-medium text-[#9a9680]">{bar.suffix}</span>}
                </div>
                <div className="h-2 rounded-full bg-[#3a3a2a] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: bar.color, minWidth: pct > 0 ? '4px' : '0' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
  }
}

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLang();
  const article = slug ? getLocalizedArticle(slug, lang) : undefined;

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — Diet Tracker`;
      if (slug) trackArticleOpened(slug);
    }
    return () => {
      document.title = 'Diet Tracker — AI-Powered Nutrition & Calorie Tracker';
    };
  }, [article, slug]);

  if (!article) {
    return (
      <div className="flex flex-col min-h-full pb-24">
        <div className="px-4 pt-12 pb-4">
          <Link to="/articles" className="text-sm text-[#7cb87a] hover:text-[#8fce8d]">
            {t.backToArticles}
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#5a5a44] text-sm">{t.articleNotFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-24 animate-fade-in">
      {/* Back link */}
      <div className="px-4 pt-12 pb-2">
        <Link to="/articles" className="text-sm text-[#7cb87a] hover:text-[#8fce8d] transition-colors">
          {t.backToArticles}
        </Link>
      </div>

      <article className="px-4 pt-4">
        {/* Article header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl" aria-hidden="true">{article.emoji}</span>
            <span className="text-xs text-[#5a5a44]">{article.readTimeMinutes} {t.minRead}</span>
          </div>
          <h1 className="text-xl font-bold text-[#f0ede4] leading-snug mb-3">{article.title}</h1>
          <p className="text-sm text-[#9a9680] leading-relaxed">{article.excerpt}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#2e2e22] text-[#9a9680]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article content */}
        <section className="space-y-4">
          {article.content.map((section, i) => renderSection(section, i))}
        </section>
      </article>
    </div>
  );
}
