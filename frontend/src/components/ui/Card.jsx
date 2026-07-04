export function Card({ children, className = "", noPadding = false, hoverEffect = false, ...props }) {
    return (
        <div
            className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm transition-all duration-300 ${hoverEffect ? 'hover:shadow-md hover:-translate-y-1 hover:border-slate-300/80' : ''} ${noPadding ? '' : 'p-6'} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
