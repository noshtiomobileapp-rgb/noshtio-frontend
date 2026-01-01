const vision = require("@google-cloud/vision");

(async () => {
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection("scripts/Bhukkhaar_Menu.jpg");
  console.log(result.fullTextAnnotation?.text || "NO TEXT");
})();
