'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.saveImageToR2 = saveImageToR2;
const common_1 = require('@nestjs/common');
const crypto_1 = require('crypto');
async function saveImageToR2(url, storageService, token) {
  if (!url) throw new common_1.BadRequestException('Image URL is required');
  if (url.startsWith('data:')) {
    const match = url.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match)
      throw new common_1.BadRequestException('Invalid base64 image URL');
    const mime = match[1];
    const b64 = match[2];
    const buffer = Buffer.from(b64, 'base64');
    const name = `${Date.now()}-${(0, crypto_1.randomBytes)(6).toString('hex')}.img`;
    try {
      return await storageService.upload(buffer, name, mime);
    } catch (err) {
      console.warn(
        'saveImageToR2: upload failed, returning original URL',
        err && err.message ? err.message : err,
      );
      return url;
    }
  }
  const headers = {};
  if (token) headers['authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new common_1.BadRequestException(
      `Failed to fetch image: ${res.status}`,
    );
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new common_1.BadRequestException(
      'Remote URL did not return an image content-type',
    );
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = `${Date.now()}-${(0, crypto_1.randomBytes)(6).toString('hex')}.img`;
  try {
    return await storageService.upload(buffer, name, contentType);
  } catch (err) {
    console.warn(
      'saveImageToR2: upload failed, returning original URL',
      err && err.message ? err.message : err,
    );
    return url;
  }
}
//# sourceMappingURL=saveImageToR2.js.map
