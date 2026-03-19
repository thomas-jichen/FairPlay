import { ISEF_CATEGORIES } from '../../constants/categories'

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1 justify-center mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-150 ${
          !selected
            ? 'bg-white/[0.12] text-white/90 border border-white/[0.15]'
            : 'bg-transparent text-white/35 border border-transparent hover:text-white/50'
        }`}
      >
        All
      </button>
      {ISEF_CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-150 ${
            selected === cat.value
              ? 'bg-white/[0.12] text-white/90 border border-white/[0.15]'
              : 'bg-transparent text-white/35 border border-transparent hover:text-white/50'
          }`}
        >
          {cat.value}
        </button>
      ))}
    </div>
  )
}
