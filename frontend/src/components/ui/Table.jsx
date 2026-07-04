export function Table({ children, className = "" }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white ${className}`}>
            <table className="w-full text-sm text-left text-slate-600">
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children }) {
    return (
        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
            {children}
        </thead>
    );
}

export function TableRow({ children, className = "", isHoverable = true }) {
    return (
        <tr className={`border-b border-slate-100 last:border-0 ${isHoverable ? 'hover:bg-slate-50/80 transition-colors' : ''} ${className}`}>
            {children}
        </tr>
    );
}

export function TableHead({ children, className = "" }) {
    return <th className={`px-6 py-4 font-semibold text-slate-700 ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "" }) {
    return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}
