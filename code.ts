const nodes = {
  fullPage: 0,
};
const page = figma.currentPage;
const checklist = "design-qa/checklist";
const componentSet = figma.currentPage.findOne(
  (node) => node.type === "COMPONENT_SET" && node.key === checklist
) as ComponentSetNode;
// const instances = figma.currentPage.findAll(
//   (node) => node.type === "INSTANCE" && node.mainComponent?.key === checklist
// );
let frame: FrameNode | null = null;
let variantIdentifier = "Passed=yes";
const instance = figma.createComponent();
for (const node of page.children) {
  if (node.type === "FRAME" && node.name.includes("Full Page")) {
    frame = node;
    instance.setMainComponent(componentSet);
    // let instance = instances.find((node) => node.variantIden === variantIdentifier)
  }
}

// if (frame) {
//   let isDesignQa = figma.root.findOne(
//     (node) => node.type === "PAGE" && node.name === "Design QA"
//   ) as PageNode;
//   if (isDesignQa) {
//     figma.currentPage = isDesignQa;
//   } else {
//     let designQa = figma.createPage();
//     designQa.name = "Design QA";
//     // figma.currentPage = designQa;
//   }
// }

figma.closePlugin();
