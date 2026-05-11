import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CVData } from "../context/CVContext";

/**
 * Convert OKLCH -> RGB
 */
function convertOklchToRgb(input: string): string {
  try {
    const match = input.match(
      /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i,
    );

    if (!match) return "rgb(0,0,0)";

    let [, l, c, h, alpha] = match;

    let L = l.includes("%")
      ? parseFloat(l) / 100
      : parseFloat(l);

    const C = parseFloat(c);
    const H = parseFloat(h);
    const A = alpha ? parseFloat(alpha) : 1;

    const hr = (H * Math.PI) / 180;

    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);

    return oklabToRgb(L, a, b, A);
  } catch {
    return "rgb(0,0,0)";
  }
}

/**
 * Convert OKLAB -> RGB
 */
function convertOklabToRgb(input: string): string {
  try {
    const match = input.match(
      /oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i,
    );

    if (!match) return "rgb(0,0,0)";

    let [, l, a, b, alpha] = match;

    let L = l.includes("%")
      ? parseFloat(l) / 100
      : parseFloat(l);

    const A = parseFloat(a);
    const B = parseFloat(b);
    const opacity = alpha ? parseFloat(alpha) : 1;

    return oklabToRgb(L, A, B, opacity);
  } catch {
    return "rgb(0,0,0)";
  }
}

/**
 * Shared OKLAB -> RGB math
 */
function oklabToRgb(
  L: number,
  a: number,
  b: number,
  alpha = 1,
): string {
  let l = L + 0.3963377774 * a + 0.2158037573 * b;
  let m = L - 0.1055613458 * a - 0.0638541728 * b;
  let s = L - 0.0894841775 * a - 1.291485548 * b;

  l = l ** 3;
  m = m ** 3;
  s = s ** 3;

  let r =
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;

  let g =
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;

  let blue =
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gamma = (x: number) => {
    x = Math.max(0, Math.min(1, x));

    return x <= 0.0031308
      ? 12.92 * x
      : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };

  r = Math.round(gamma(r) * 255);
  g = Math.round(gamma(g) * 255);
  blue = Math.round(gamma(blue) * 255);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${blue}, ${alpha})`;
  }

  return `rgb(${r}, ${g}, ${blue})`;
}

/**
 * Replace all unsupported colors
 */
function sanitizeColorFunctions(value: string): string {
  if (!value) return value;

  value = value.replace(/oklch\([^)]+\)/gi, (match) =>
    convertOklchToRgb(match),
  );

  value = value.replace(/oklab\([^)]+\)/gi, (match) =>
    convertOklabToRgb(match),
  );

  return value;
}

/**
 * Export PDF
 */
export async function exportToPDF(
  cvData: CVData,
  previewElement: HTMLElement,
): Promise<void> {
  try {
    if (!previewElement) {
      throw new Error("Preview element missing");
    }

    // Wait for element to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(previewElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 0,
      removeContainer: true,

      onclone: (clonedDoc) => {
        try {
          clonedDoc.documentElement.classList.remove("dark");
          clonedDoc.documentElement.classList.add("light");

          // Ensure images are high quality
          clonedDoc.querySelectorAll('img').forEach((img) => {
            img.style.imageRendering = 'high-quality';
            img.style.imageRendering = '-webkit-optimize-contrast';
          });

          /**
           * Convert stylesheet rules
           */
          Array.from(clonedDoc.styleSheets).forEach((sheet) => {
            try {
              const rules = Array.from(sheet.cssRules || []);

              rules.forEach((rule: any) => {
                if (!rule.style) return;

                for (let i = 0; i < rule.style.length; i++) {
                  const prop = rule.style[i];

                  const value =
                    rule.style.getPropertyValue(prop);

                  if (
                    value.includes("oklch(") ||
                    value.includes("oklab(")
                  ) {
                    rule.style.setProperty(
                      prop,
                      sanitizeColorFunctions(value),
                    );
                  }
                }
              });
            } catch {
              // Ignore cross-origin stylesheets
            }
          });

          /**
           * Convert element styles
           */
          clonedDoc.querySelectorAll("*").forEach((element) => {
            const htmlEl = element as HTMLElement;

            const computed = window.getComputedStyle(element);

            Array.from(computed).forEach((prop) => {
              try {
                const value = computed.getPropertyValue(prop);

                if (
                  value.includes("oklch(") ||
                  value.includes("oklab(")
                ) {
                  htmlEl.style.setProperty(
                    prop,
                    sanitizeColorFunctions(value),
                    "important",
                  );
                }
              } catch {}
            });

            const inline = htmlEl.getAttribute("style");

            if (
              inline?.includes("oklch(") ||
              inline?.includes("oklab(")
            ) {
              htmlEl.setAttribute(
                "style",
                sanitizeColorFunctions(inline),
              );
            }
          });
        } catch (e) {
          console.error("Clone sanitize failed:", e);
        }
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
      );

      heightLeft -= pdfHeight;
    }

    let fileName = "My_CV.pdf";

    if (cvData?.personalInfo?.fullName) {
      fileName = `${cvData.personalInfo.fullName.replace(
        /\s+/g,
        "_",
      )}_CV.pdf`;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Export Error:", error);

    throw new Error("Failed to generate PDF");
  }
}

export async function exportToPDFBlob(
  cvData: CVData,
  previewElement: HTMLElement,
): Promise<Blob> {
  try {
    if (!previewElement) {
      throw new Error("Preview element missing");
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(previewElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 0,
      removeContainer: true,

      onclone: (clonedDoc) => {
        try {
          clonedDoc.documentElement.classList.remove("dark");
          clonedDoc.documentElement.classList.add("light");

          clonedDoc.querySelectorAll('img').forEach((img) => {
            img.style.imageRendering = 'high-quality';
            img.style.imageRendering = '-webkit-optimize-contrast';
          });

          Array.from(clonedDoc.styleSheets).forEach((sheet) => {
            try {
              const rules = Array.from(sheet.cssRules || []);

              rules.forEach((rule: any) => {
                if (!rule.style) return;

                for (let i = 0; i < rule.style.length; i++) {
                  const prop = rule.style[i];

                  const value =
                    rule.style.getPropertyValue(prop);

                  if (
                    value.includes("oklch(") ||
                    value.includes("oklab(")
                  ) {
                    rule.style.setProperty(
                      prop,
                      sanitizeColorFunctions(value),
                    );
                  }
                }
              });
            } catch {
              // Ignore cross-origin stylesheets
            }
          });

          clonedDoc.querySelectorAll("*").forEach((element) => {
            const htmlEl = element as HTMLElement;

            const computed = window.getComputedStyle(element);

            Array.from(computed).forEach((prop) => {
              try {
                const value = computed.getPropertyValue(prop);

                if (
                  value.includes("oklch(") ||
                  value.includes("oklab(")
                ) {
                  htmlEl.style.setProperty(
                    prop,
                    sanitizeColorFunctions(value),
                    "important",
                  );
                }
              } catch {}
            });

            const inline = htmlEl.getAttribute("style");

            if (
              inline?.includes("oklch(") ||
              inline?.includes("oklab(")
            ) {
              htmlEl.setAttribute(
                "style",
                sanitizeColorFunctions(inline),
              );
            }
          });
        } catch (e) {
          console.error("Clone sanitize failed:", e);
        }
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
      );

      heightLeft -= pdfHeight;
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("PDF Export Error:", error);
    throw new Error("Failed to generate PDF");
  }
}