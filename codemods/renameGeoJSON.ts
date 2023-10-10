import * as ts from "typescript";

function renameGeoJSONConflict(sourceFile: ts.SourceFile): ts.SourceFile {
  const printer = ts.createPrinter();
  const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
      // If the node is a class declaration named "GeoJSON"
      if (ts.isClassDeclaration(node) && node.name?.text === "GeoJSON") {
        // Rename the class
        const renamedClass = ts.factory.updateClassDeclaration(
          node,
          node.decorators,
          node.modifiers,
          ts.factory.createIdentifier("LeafletGeoJSON"),
          node.typeParameters,
          node.heritageClauses,
          node.members
        );
        return renamedClass;
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };

  const result = ts.transform(sourceFile, [transformer]);
  return result.transformed[0] as ts.SourceFile;
}

// Usage
const fileName = "../types/leaflet.d.ts";
const text = ts.sys.readFile(fileName)!;
const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const newSourceFile = renameGeoJSONConflict(sourceFile);
const newText = ts.createPrinter().printFile(newSourceFile);
ts.sys.writeFile(fileName, newText);
