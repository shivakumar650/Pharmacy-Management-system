export function Badge({ children, variant = "neutral", className = "", ...props }) {
    const variants = {
        neutral: "bg-slate-100 text-slate-700 border-slate-200",
        success: "bg-emerald-100 text-emerald-700 border-emerald-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        danger: "bg-red-100 text-red-700 border-red-200",
        primary: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${variants[variant] || variants.neutral} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
