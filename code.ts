const nodes = {
  fullPage: 0,
};
const page = figma.currentPage;
let frame: FrameNode | null = null;
let count = 0;

for (const node of page.children) {
  if (node.type === "FRAME" && node.name.includes("Full Page")) {
    frame = node as FrameNode;
    nodes.fullPage += 1;
  }
  count += 1;
}

if (frame) {
  console.log(nodes.fullPage, count);
}

// for (let i = 0; i < numberOfRectangles; i++) {
//   const rect = figma.createRectangle();
//   rect.x = i * 150;
//   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//   figma.currentPage.appendChild(rect);
//   nodes.push(rect);
// }
// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
