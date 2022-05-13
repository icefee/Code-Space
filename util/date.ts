export function formatDate(dateString: string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const map = new Map();
    const date = new Date(dateString);
    map.set('Y', date.getFullYear())
        .set('M', date.getMonth() + 1)
        .set('D', date.getDate())
        .set('H', date.getHours())
        .set('m', date.getMinutes())
        .set('s', date.getSeconds())
    return format.replace(
        new RegExp('(' + [...Array.from(map.keys())].join('+|') + '+)', 'g'),
        (v, _w, x, y) => String(map.get(y[x])).padStart(v.length, '0')
    )
}
