export function Skeleton({ className = "", variant = "text" }) {
    const baseStyle = "animate-pulse bg-slate-200";
    const variants = {
        text: "h-4 w-full rounded",
        circular: "rounded-full",
        rectangular: "rounded-xl"
    };

    return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
}
