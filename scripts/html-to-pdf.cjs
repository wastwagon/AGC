const path = require("path");
const { chromium } = require(path.join(
  __dirname,
  "..",
  "agc-site",
  "node_modules",
  "playwright"
));

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "OceanCyber-AGC-Development-Proposal.html");
const pdfPath = path.join(root, "OceanCyber-AGC-Development-Proposal.pdf");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
  });
  await browser.close();
  console.log("Wrote", pdfPath);
})();
