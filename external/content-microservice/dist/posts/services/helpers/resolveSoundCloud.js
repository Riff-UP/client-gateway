"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSoundCloud = resolveSoundCloud;
const common_1 = require("@nestjs/common");
async function resolveSoundCloud(url) {
    if (!url)
        throw new common_1.BadRequestException('SoundCloud URL is required');
    const oembed = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    const res = await fetch(oembed);
    if (!res.ok)
        throw new common_1.BadRequestException('Invalid SoundCloud URL');
    const json = (await res.json());
    const provider_meta = {
        title: json.title,
        author_name: json.author_name,
        thumbnail_url: json.thumbnail_url,
        embed_html: json.html,
        provider_url: url,
    };
    const media_url = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&show_artwork=true`;
    return { media_url, provider_meta };
}
//# sourceMappingURL=resolveSoundCloud.js.map