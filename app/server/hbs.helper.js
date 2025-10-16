export const hbsHelpers = {
    eq: (a, b) => String(a) === String(b),
    range: (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start),
    formatMoney: (n) => {
        try { return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n); }
        catch { return n; }
    },
    formatDate: (d) => {
        try { return new Date(d).toLocaleString("es-AR"); }
        catch { return d; }
    }
};