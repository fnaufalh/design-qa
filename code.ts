const FONT_FAMILY = "Inter";
const FONT_STYLE = "Regular";
const DESIGN_SYSTEM_KEY = "1216442510161674043";
// const DESIGN_SYSTEM_KEY = "0dMwxDkJCq5dAFfPzPzmhy";
// const CHECKLIST_KEY = "13138701841ec77a328d4208d87404069a878e9c";
const CHECKLIST_KEY = "48b5f24279635a9db0aa24b5cc265330d1e8aeaa";
const CHECKLIST_ITEMS = [
  "Full Page",
  "Error",
  "Empty State",
  "Top Bar Behavior",
  "ID",
  "EN",
];

async function designSystem() {
  const component = await figma.importComponentByKeyAsync(DESIGN_SYSTEM_KEY);
}

designSystem();

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: FONT_FAMILY, style: FONT_STYLE }),
  ]);
}

function createAutoLayout() {
  const autoLayout = figma.createFrame();
  autoLayout.name = "Design QA Results";
  autoLayout.layoutMode = "VERTICAL";
  autoLayout.layoutAlign = "STRETCH";
  autoLayout.counterAxisSizingMode = "AUTO";
  return autoLayout;
}

function findChecklistComponent(variantIdentifier: string) {
  const componentSet = figma.currentPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.key === CHECKLIST_KEY
  ) as ComponentSetNode;
  return componentSet.findOne(
    (node) => node.type === "COMPONENT" && node.name === variantIdentifier
  ) as ComponentNode;
}

function createChecklistInstance(
  item: string,
  count: number,
  variantIdentifier: string
) {
  const componentNode = findChecklistComponent(variantIdentifier);
  const instance = componentNode.createInstance();
  const textNode = instance.findOne(
    (node) => node.type === "TEXT" && node.name === "Checklist"
  ) as TextNode;
  const textCountNode = instance.findOne(
    (node) => node.type === "TEXT" && node.name === "Count"
  ) as TextNode;
  textNode.characters = item;
  textCountNode.characters = `(${count} Frame)`;
  return instance;
}

function createBranchInstances(
  children: SceneNode[],
  childNames: Record<string, string>,
  item: string,
  variantIdentifier: string
) {
  const branchInstances: InstanceNode[] = [];
  for (const child of children) {
    childNames[item] = child.name;
    variantIdentifier = "Passed=yes, Branch=yes";
    const branchComponentNode = findChecklistComponent(variantIdentifier);
    const branchInstance = branchComponentNode.createInstance();
    const branchTextNode = branchInstance.findOne(
      (node) => node.type === "TEXT" && node.name === "Branch Checklist"
    ) as TextNode;
    branchTextNode.characters = childNames[item];
    branchInstances.push(branchInstance);
  }
  return branchInstances;
}

async function designQa() {
  await loadFonts();
  const countByCheck: Record<string, number> = {};
  const childNames: Record<string, string> = {};
  const page = figma.currentPage;
  const autoLayout = createAutoLayout();

  for (const item of CHECKLIST_ITEMS) {
    let variantIdentifier = "Passed=yes, Branch=no";
    const children = page.findAll(
      (node) => node.type === "FRAME" && node.name.includes(item)
    );
    countByCheck[item] = children.length;
    if (children.length > 0) {
      const checklistInstance = createChecklistInstance(
        item,
        countByCheck[item],
        variantIdentifier
      );
      autoLayout.appendChild(checklistInstance);
      const branchInstances = createBranchInstances(
        children,
        childNames,
        item,
        variantIdentifier
      );
      for (const branchInstance of branchInstances) {
        autoLayout.appendChild(branchInstance);
      }
    } else {
      variantIdentifier = "Passed=no, Branch=no";
      const checklistInstance = createChecklistInstance(
        item,
        countByCheck[item],
        variantIdentifier
      );
      autoLayout.appendChild(checklistInstance);
    }
  }

  if (countByCheck) {
    let designQa = figma.root.findOne(
      (node) => node.type === "PAGE" && node.name === "Design QA Results"
    ) as PageNode;
    if (!designQa) {
      designQa = figma.createPage();
      designQa.name = "Design QA Results";
    } else {
      figma.currentPage = designQa;
      designQa.appendChild(autoLayout);
    }
  }
  figma.closePlugin();
}

designQa()
  .then(() => {
    figma.closePlugin();
  })
  .catch((error) => {
    console.error("Failed to run plugin:", error);
  });
