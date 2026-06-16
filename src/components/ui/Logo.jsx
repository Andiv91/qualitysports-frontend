import { Link } from 'react-router-dom'

export default function Logo({ to, src, variant = 'light', linkClassName = '' }) {
  const qualityColor = variant === 'dark' ? 'text-white' : 'text-[#1C1C1E]'

  const inner = (
    <div className="flex items-center gap-2.5">
      {src ? (
        <img src={src} alt="Quality Sports" className="h-13 w-auto" />
      ) : (
        <div className="w-8 h-8 bg-[#C0392B] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">QS</span>
        </div>
      )}
      <div className="leading-none">
        <span className={`font-bold text-sm tracking-[0.08em] ${qualityColor}`}>QUALITY</span>
        <span className="block text-[9px] text-[#C0392B] tracking-[0.3em] font-semibold">SPORTS</span>
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className={`hover:opacity-80 transition-opacity ${linkClassName}`}>
        {inner}
      </Link>
    )
  }
  return inner
}
