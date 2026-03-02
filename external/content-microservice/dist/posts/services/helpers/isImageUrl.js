"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImageUrl = isImageUrl;
function isImageUrl(u) {
    if (!u)
        return false;
    const imgExt = /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i;
    if (u.startsWith('data:image/'))
        return true;
    if (imgExt.test(u))
        return true;
    try {
        const parsed = new URL(u);
        return imgExt.test(parsed.pathname);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=isImageUrl.js.map