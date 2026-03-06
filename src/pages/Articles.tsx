import { Link } from 'react-router-dom';
import { getLocalizedArticles } from '../lib/articles';
import { useLang } from '../store/langContext';
import { TutorialHint } from '../components/TutorialHint';

export function Articles() {
  const { t, lang } = useLang();
  const articles = getLocalizedArticles(lang);

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-xl font-bold text-[#f0ede4]">{t.articlesTitle}</h1>
        <p className="text-sm text-[#9a9680] mt-1">{t.articlesSubtitle}</p>
      </div>

      {/* Tutorial hint */}
      <TutorialHint
        storageKey="dtk_hint_articles"
        title={t.tutorialArticlesTitle}
        body={t.tutorialArticlesBody}
        dismissLabel={t.tutorialDismiss}
        emoji="📚"
      />

      {/* Article cards */}
      <div className="px-4 space-y-4">
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="block rounded-2xl border border-[#3a3a2a] bg-[#242419] overflow-hidden card-hover animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
            aria-label={article.title}
          >
            {/* Card header */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0" aria-hidden="true">{article.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-[#f0ede4] leading-snug">{article.title}</h2>
                  <p className="text-sm text-[#9a9680] mt-1 line-clamp-2">{article.excerpt}</p>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#3a3a2a]">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#2e2e22] text-[#9a9680]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-[#5a5a44] shrink-0 ml-2">
                  {article.readTimeMinutes} {t.minRead}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
