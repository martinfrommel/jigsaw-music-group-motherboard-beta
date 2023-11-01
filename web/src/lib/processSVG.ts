// processSVG.ts

export function processSVGForBg(svgContent: string, color: string): string {
  const processedSVG = svgContent.replace(/fill="[^"]*"/g, `fill="${color}"`)
  const base64 = btoa(processedSVG)
  return `data:image/svg+xml;base64,${base64}`
}
