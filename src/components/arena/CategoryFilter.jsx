import { ISEF_CATEGORIES } from '../../constants/categories'

export default function CategoryFilter({ selected, onSelect }) {
  const baseClass = 'shrink-0 snap-start px-3 py-1.5 type-caption text-xs transition-colors duration-200'

  return (
    <div className="relative mb-3 -mx-4 sm:mx-0">
      <div className="scrollbar-none flex sm:flex-wrap gap-1.5 sm:justify-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory px-4 sm:px-0 pb-1 sm:pb-0">
        <button
          onClick={() => onSelect(null)}
          className={`${baseClass} ${
            !selected
              ? 'glossy-black-cta text-white/90 ring-1 ring-amber-400/30'
              : 'rounded-full text-white/30 hover:text-white/60 border border-transparent'
          }`}
        >
          All
        </button>
        {ISEF_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`${baseClass} ${
              selected === cat.value
                ? 'glossy-black-cta text-white/90 ring-1 ring-amber-400/30'
                : 'rounded-full text-white/30 hover:text-white/60 border border-transparent'
            }`}
          >
            {cat.value}
          </button>
        ))}
      </div>
      <div aria-hidden className="sm:hidden pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#08080c] to-transparent" />
      <div aria-hidden className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#08080c] to-transparent" />
    </div>
  )
}
