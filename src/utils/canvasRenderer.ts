import QRCode from 'qrcode';
import { BRAND_COLORS } from '../assets/branding/colors';
import { getBuilderTitle } from './titleGenerator';
import { generateDeterministicId } from './idGenerator';
import sampleBuilderPass from '../assets/references/sample-builder-pass.png';

export interface RenderOptions {
  name: string;
  role: string;
  location?: string;
  vibe?: string;
  qrUrl?: string;
  builderTitle?: string;
}

// Wait for custom fonts to load
export const waitFontsLoaded = async () => {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Fonts loading failed or timed out", e);
    }
  }
};

// Cover-crop math function: calculates source coordinates to cover-fit an image inside a box
interface CropDetails {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

const getCoverCropDetails = (
  imgWidth: number,
  imgHeight: number,
  destWidth: number,
  destHeight: number,
  yFocusOffset: number = 0.35
): CropDetails => {
  const imgRatio = imgWidth / imgHeight;
  const destRatio = destWidth / destHeight;
  
  let sw, sh, sx, sy;
  
  if (imgRatio > destRatio) {
    sh = imgHeight;
    sw = imgHeight * destRatio;
    sy = 0;
    sx = (imgWidth - sw) * 0.5;
  } else {
    sw = imgWidth;
    sh = imgWidth / destRatio;
    sx = 0;
    sy = (imgHeight - sh) * yFocusOffset;
    if (sy < 0) sy = 0;
    if (sy + sh > imgHeight) sy = imgHeight - sh;
  }
  
  return { sx, sy, sw, sh };
};

/**
 * Helper to draw text that scales down automatically if it exceeds max allowed width.
 */
const drawTextAutoScaled = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  baseSize: number,
  minSize: number,
  weight: string,
  fontFamily: string,
  color: string,
  align: 'left' | 'center' = 'left'
) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  
  let size = baseSize;
  ctx.font = `${weight} ${size}px ${fontFamily}`;
  let width = ctx.measureText(text).width;
  
  while (width > maxWidth && size > minSize) {
    size -= 1;
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    width = ctx.measureText(text).width;
  }
  
  ctx.fillText(text, x, y);
  ctx.restore();
  return size; // returns final used font size
};

/**
 * Draws the Format B Builder ID Card (723 x 1024 px)
 */
export const drawFormatB = async (
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  options: RenderOptions
): Promise<void> => {
  await waitFontsLoaded();
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not get 2D context");
  
  canvas.width = 723;
  canvas.height = 1024;
  ctx.clearRect(0, 0, 723, 1024);
  
  // 1. Draw the background template image
  const templateImg = new Image();
  templateImg.src = sampleBuilderPass;
  await new Promise<void>((resolve, reject) => {
    templateImg.onload = () => resolve();
    templateImg.onerror = () => reject(new Error("Failed to load background template image"));
  });
  ctx.drawImage(templateImg, 0, 0, 723, 1024);

  // 1.5 Capture the BUILD/SHIP/REPEAT sticker area before drawing the photo (Width 102 to cover X=12 to X=114 exactly)
  const stickerX = 12;
  const stickerY = 440;
  const stickerW = 102;
  const stickerH = 120;
  const stickerData = ctx.getImageData(stickerX, stickerY, stickerW, stickerH);

  // 2. Draw user photo inside the circular frame (Center: 206, 446, Radius: 142 fits template perfectly)
  const photoX = 206;
  const photoY = 446;
  const photoR = 142; // inner radius to fit inside template frame border
  
  // Erase any background duplicate photo/shadow behind the frame
  ctx.save();
  ctx.fillStyle = '#F9F6F4'; // template card cream background inside the circle
  ctx.beginPath();
  ctx.arc(photoX, photoY, 142, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.clip();
  
  const cover = getCoverCropDetails(img.width, img.height, photoR * 2, photoR * 2, 0.32);
  ctx.drawImage(
    img, 
    cover.sx, cover.sy, cover.sw, cover.sh, 
    photoX - photoR, photoY - photoR, 
    photoR * 2, photoR * 2
  );
  ctx.restore();

  // 2.5 Put the sticker and its original frame segments back on top of the photo
  ctx.putImageData(stickerData, stickerX, stickerY);

  // 3. Clear and render text values to prevent overlapping with templates
  // details container width is 245px starting at X=450
  const detailX = 460;
  const maxTextW = 235;

  // Name
  drawTextAutoScaled(
    ctx, 
    options.name.trim().toUpperCase(), 
    detailX, 315, 
    maxTextW, 26, 14, 
    '900', 'Outfit, sans-serif', 
    BRAND_COLORS.green, 'left'
  );

  // Stack / Role
  drawTextAutoScaled(
    ctx, 
    options.role.trim().toUpperCase(), 
    detailX, 383, 
    maxTextW, 20, 14, 
    '900', 'Outfit, sans-serif', 
    BRAND_COLORS.pink, 'left'
  );

  // Builder Title
  const rawTitle = options.builderTitle || getBuilderTitle(options.role);
  const titleText = `⚡ ${rawTitle.trim().toUpperCase()} ⚡`;
  
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  
  let titleSize = 16;
  ctx.font = `900 ${titleSize}px Outfit, sans-serif`;
  let titleW = ctx.measureText(titleText).width;
  while (titleW > maxTextW && titleSize > 14) {
    titleSize -= 1;
    ctx.font = `900 ${titleSize}px Outfit, sans-serif`;
    titleW = ctx.measureText(titleText).width;
  }
  
  // Render lightning bolts in pink and text in green
  const parts = titleText.split(/⚡/);
  let curX = detailX;
  
  ctx.fillStyle = BRAND_COLORS.pink;
  ctx.fillText("⚡", curX, 451);
  curX += ctx.measureText("⚡ ").width;
  
  ctx.fillStyle = BRAND_COLORS.green;
  const coreTitle = parts[1] || "";
  ctx.fillText(coreTitle, curX, 451);
  curX += ctx.measureText(coreTitle).width;
  
  ctx.fillStyle = BRAND_COLORS.pink;
  ctx.fillText(" ⚡", curX, 451);
  
  ctx.restore();

  // Location
  const locVal = (options.location || 'BENGALURU').trim().toUpperCase();
  drawTextAutoScaled(
    ctx, 
    locVal, 
    detailX, 517, 
    maxTextW, 20, 14, 
    '900', 'Outfit, sans-serif', 
    BRAND_COLORS.pink, 'left'
  );

  // Vibe / Fun Fact
  const rawVibe = (options.vibe || 'BUILD ➔ SHIP ➔ REPEAT').trim().toUpperCase();
  ctx.save();
  ctx.fillStyle = BRAND_COLORS.green;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Check if text needs to wrap to two lines
  ctx.font = '900 18px Outfit, sans-serif';
  const vibeWidth = ctx.measureText(rawVibe).width;
  
  if (vibeWidth <= maxTextW) {
    // Fits in a single line
    drawTextAutoScaled(ctx, rawVibe, detailX, 595, maxTextW, 18, 14, '900', 'Outfit, sans-serif', BRAND_COLORS.green, 'left');
  } else {
    // Split into two lines at space
    const words = rawVibe.split(' ');
    let line1 = '';
    let line2 = '';
    let middle = Math.floor(words.length / 2);
    
    // Distribute words relatively equally
    for (let i = 0; i < words.length; i++) {
      if (i < middle) {
        line1 += words[i] + ' ';
      } else {
        line2 += words[i] + ' ';
      }
    }
    
    line1 = line1.trim();
    line2 = line2.trim();
    
    // Scale both lines down if either exceeds width limit
    let vibeSize = 18;
    ctx.font = `900 ${vibeSize}px Outfit, sans-serif`;
    let w1 = ctx.measureText(line1).width;
    let w2 = ctx.measureText(line2).width;
    
    while ((w1 > maxTextW || w2 > maxTextW) && vibeSize > 14) {
      vibeSize -= 1;
      ctx.font = `900 ${vibeSize}px Outfit, sans-serif`;
      w1 = ctx.measureText(line1).width;
      w2 = ctx.measureText(line2).width;
    }
    
    const lh = vibeSize + 2; // line height spacing
    ctx.fillText(line1, 460, 595 - lh/2);
    ctx.fillText(line2, 460, 595 + lh/2);
  }
  ctx.restore();

  // Dynamic Location on bottom ticket (Origin column)
  ctx.fillStyle = '#F4EFE8'; // exact background color at Origin
  ctx.fillRect(30, 685, 100, 42);
  drawTextAutoScaled(ctx, locVal, 80, 705, 90, 22, 14, '900', 'Outfit, sans-serif', BRAND_COLORS.green, 'center');

  // Builder ID & Barcode Columns (Erase both placeholders completely and draw unique ID in barcode space)
  const builderId = generateDeterministicId(options.name, options.role).toUpperCase();
  ctx.fillStyle = '#F4EFE8'; // exact background color
  ctx.fillRect(520, 658, 185, 135); // clear entire ID and barcode column height

  // Draw the Builder ID in the barcode place (centered in the column at Y=725)
  drawTextAutoScaled(ctx, builderId, 605, 725, 160, 26, 14, '900', 'Outfit, sans-serif', BRAND_COLORS.green, 'center');

  // QR Code
  ctx.fillStyle = '#FFFFFF'; // pure white background inside the QR card base
  ctx.fillRect(539, 827, 148, 153);
  
  const qrUrl = options.qrUrl || window.location.origin;
  try {
    const qrSize = 132;
    const qrX = 547;
    const qrY = 835;
    
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      margin: 1,
      width: qrSize,
      color: {
        dark: BRAND_COLORS.green,
        light: '#FFFFFF',
      },
    });
    
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise<void>((resolve, reject) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => reject(new Error("Failed to load dynamic QR code image"));
    });
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    
    // Draw mini palm stamp in the middle of QR code
    const logoSize = 26;
    const logoX = qrX + (qrSize - logoSize) / 2;
    const logoY = qrY + (qrSize - logoSize) / 2;
    
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(logoX - 1.5, logoY - 1.5, logoSize + 3, logoSize + 3, 4);
    ctx.fill();
    
    ctx.fillStyle = BRAND_COLORS.pink;
    ctx.beginPath();
    ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 - 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(logoX + logoSize/2 - 1.5, logoY + logoSize/2 - 3, 3, 11);
    ctx.beginPath();
    ctx.ellipse(logoX + logoSize/2, logoY + logoSize/2 - 3, 5, 2, -30 * Math.PI/180, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(logoX + logoSize/2, logoY + logoSize/2 - 3, 5, 2, 30 * Math.PI/180, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
  } catch (err) {
    console.error("Failed to generate custom QR Code inside card", err);
  }
};
