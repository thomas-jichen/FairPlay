import { ISEF_CATEGORIES } from '../../constants/categories'

export default function CategorySelect({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">
        ISEF Category
        <span className="ml-1 text-red-400">*</span>
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full appearance-none rounded-lg border border-border-default bg-surface-tertiary
                     px-4 py-3 pr-10 text-text-primary
                     focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
                     cursor-pointer"
        >
          <option value="">Select your category...</option>
          {ISEF_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label} ({cat.value})
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
