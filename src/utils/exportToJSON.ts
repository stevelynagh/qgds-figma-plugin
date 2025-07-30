import { processCollection } from './processCollection';

export async function exportToJSON() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  // Process all collections in parallel
  const processedCollections = await Promise.all(
    collections.map((collection) => processCollection(collection))
  );

  // Flatten the array of arrays into a single array
  const files = processedCollections.flat();

  files.forEach((processed) => console.log(processed));

  return files;
}
