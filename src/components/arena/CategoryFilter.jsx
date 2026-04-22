import { ISEF_CATEGORIES } from '../../constants/categories'

export default function CategoryFilter({ selected, onSelect }) {
  const baseClass = 'px-3 py-1.5 type-caption text-xs transition-colors duration-200'

  return (
    <div className="flex flex-wrap gap-1.5 justify-center mb-3">
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
  )
}
