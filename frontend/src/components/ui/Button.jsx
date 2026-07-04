export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    ...props
}) {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none select-none relative overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 text-white to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm hover:shadow-md hover:-translate-y-[1px] focus:ring-blue-500 border border-transparent",
        secondary: "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm focus:ring-slate-500",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500 border border-transparent",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-2.5 text-base",
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {variant === 'primary' && !isLoading && !props.disabled && (
                <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 pointer-events-none"></span>
            )}

            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
}
