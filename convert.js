function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

function rgbToOklch(r, g, b) {
    // Convert to linear sRGB
    let r_l = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    let g_l = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    let b_l = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to Oklab
    let l = 0.4122214708 * r_l + 0.5363325363 * g_l + 0.0514459929 * b_l;
    let m = 0.2119034982 * r_l + 0.6806995451 * g_l + 0.1073969566 * b_l;
    let s = 0.0883024619 * r_l + 0.2817188376 * g_l + 0.6299787005 * b_l;

    let l_ = Math.cbrt(l);
    let m_ = Math.cbrt(m);
    let s_ = Math.cbrt(s);

    let L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    let a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    let b_ok = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    // Convert to Oklch
    let C = Math.sqrt(a * a + b_ok * b_ok);
    let h = Math.atan2(b_ok, a) * 180 / Math.PI;
    if (h < 0) h += 360;

    return `oklch(${(L).toFixed(3)} ${(C).toFixed(3)} ${(h).toFixed(2)})`;
}

const colors = {
    "primary": "#181d26",
    "primary-active": "#0d1218",
    "canvas": "#ffffff",
    "surface-soft": "#f8fafc",
    "surface-strong": "#e0e2e6",
    "hairline": "#dddddd",
    "ink": "#181d26",
    "body": "#333840",
    "muted": "#41454d",
    "on-primary": "#ffffff",
    "signature-forest": "#0a2e0e",
    "signature-coral": "#aa2d00",
    "signature-cream": "#f5e9d4",
    "link": "#1b61c9",
    "success": "#006400",
    "error": "#aa2d00"
};

for (const [name, hex] of Object.entries(colors)) {
    const rgb = hexToRgb(hex);
    console.log(`${name}: ${rgbToOklch(rgb.r, rgb.g, rgb.b)}`);
}
