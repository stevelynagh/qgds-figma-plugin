import { TokenFile, TokenFileNode } from '../types';

// Type predicate in order to narrow type for a happy Typescript
function isVariableAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'VARIABLE_ALIAS'
  );
}

// Custom function to throw and error rather than Figma's returning a null value.
async function getVariableByIdAsync(id: string): Promise<Variable> {
  const variable = await figma.variables.getVariableByIdAsync(id);
  if (variable === null) {
    throw new Error(
      `Could not retreive variable with id ${id}: no variable exists!`
    );
  } else return variable;
}

function rgbToHex(color: RGB | RGBA) {
  const { r, g, b } = color;
  const hasAlpha = 'a' in color && typeof color.a === 'number';
  if (hasAlpha && color.a !== 1) {
    return `rgba(${[r, g, b]
      .map((n) => Math.round(n * 255))
      .join(', ')}, ${color.a.toFixed(4)})`;
  }
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)].join('');
  return `#${hex}`;
}

export async function processCollection({
  name,
  modes,
  variableIds,
}: {
  name: string;
  modes: {
    modeId: string;
    name: string;
  }[];
  variableIds: string[];
}) {
  const files: TokenFile[] = [];

  for (const mode of modes) {
    const file: TokenFile = {
      fileName: `${name}.${mode.name}.tokens.json`,
      body: {},
    };

    for (const variableId of variableIds) {
      const { name, resolvedType, valuesByMode } = await getVariableByIdAsync(
        variableId
      );
      const value = valuesByMode[mode.modeId];

      if (value !== undefined && ['COLOR', 'FLOAT'].includes(resolvedType)) {
        let node: TokenFileNode = file.body;
        // split the name into array repesenting each group level
        name.split('/').forEach((groupName) => {
          // look up the group object on the current node, or create it if not exists.
          node[groupName] = node[groupName] || {};

          // reassign the reference to the node one level deeper and populate it
          node = node[groupName] as TokenFileNode;
        });
        node.$type = resolvedType === 'COLOR' ? 'color' : 'number';

        if (isVariableAlias(value)) {
          const currentVar = await getVariableByIdAsync(value.id);
          node.$value = `{${currentVar.name.replace(/\//g, '.')}}`;
        } else {
          node.$value =
            resolvedType === 'COLOR' ? rgbToHex(value as RGB) : value;
        }
      }
    }
    files.push(file);
  }
  return files;
}
