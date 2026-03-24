/**
 * Read width/height from common raster formats without extra dependencies.
 * SVG is skipped here (dimensions optional; client may send width/height).
 */

function readU32BE(buf: Buffer, offset: number): number {
  return buf.readUInt32BE(offset);
}

/** PNG IHDR */
function probePng(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) {
    return null;
  }
  return { width: readU32BE(buf, 16), height: readU32BE(buf, 20) };
}

/** GIF logical screen */
function probeGif(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 10) return null;
  const sig = buf.subarray(0, 6).toString("ascii");
  if (sig !== "GIF87a" && sig !== "GIF89a") return null;
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

/** JPEG SOF0 / SOF2 */
function probeJpeg(buf: Buffer): { width: number; height: number } | null {
  let offset = 2;
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const segLen = buf.readUInt16BE(offset + 2);
    if (segLen < 2 || offset + 2 + segLen > buf.length) break;
    if (marker === 0xc0 || marker === 0xc2) {
      if (segLen < 7) return null;
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    offset += 2 + segLen;
  }
  return null;
}

/** VP8 keyframe (simple “lossy”) inside WEBP */
function probeWebpVp8(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 32) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  let pos = 12;
  while (pos + 8 <= buf.length) {
    const chunk = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    const dataStart = pos + 8;
    const dataEnd = dataStart + size;
    if (dataEnd > buf.length) break;
    if (chunk === "VP8 " && dataEnd - dataStart >= 10) {
      const d = buf.subarray(dataStart, dataEnd);
      if (d[0] !== 0x9d || d[1] !== 0x01 || d[2] !== 0x2a) break;
      const w = d.readUInt16LE(6) & 0x3fff;
      const h = d.readUInt16LE(8) & 0x3fff;
      if (w > 0 && h > 0) return { width: w, height: h };
      break;
    }
    pos = dataEnd + (size % 2);
  }
  return null;
}

export function probeRasterDimensions(
  buffer: Buffer,
  mime: string
): { width?: number; height?: number } {
  let dims: { width: number; height: number } | null = null;
  if (mime === "image/png") dims = probePng(buffer);
  else if (mime === "image/gif") dims = probeGif(buffer);
  else if (mime === "image/jpeg") dims = probeJpeg(buffer);
  else if (mime === "image/webp") dims = probeWebpVp8(buffer);

  if (!dims) return {};
  return { width: dims.width, height: dims.height };
}

export function parseOptionalDimensionsFromForm(
  rawW: string | null | undefined,
  rawH: string | null | undefined
): { width?: number; height?: number } {
  if (!rawW && !rawH) return {};
  const w = rawW ? Number.parseInt(rawW, 10) : NaN;
  const h = rawH ? Number.parseInt(rawH, 10) : NaN;
  const ok = (n: number) => Number.isFinite(n) && n > 0 && n <= 50_000;
  const out: { width?: number; height?: number } = {};
  if (ok(w)) out.width = w;
  if (ok(h)) out.height = h;
  return out;
}
