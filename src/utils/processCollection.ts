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

interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number;
}

function rgbToHex({ r, g, b, a }: RGB) {
  if (a !== 1 && a !== undefined) {
    return `rgba(${[r, g, b]
      .map((n) => Math.round(n * 255))
      .join(', ')}, ${a.toFixed(4)})`;
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
  const files = [];

  for (const mode of modes) {
    const file: {
      fileName: string;
      body: Record<string, unknown>;
    } = { fileName: `${name}.${mode.name}.tokens.json`, body: {} };

    for (const variableId of variableIds) {
      const { name, resolvedType, valuesByMode } = await getVariableByIdAsync(
        variableId
      );
      const value = valuesByMode[mode.modeId];

      if (value !== undefined && ['COLOR', 'FLOAT'].includes(resolvedType)) {
        let obj = file.body;
        name.split('/').forEach((groupName) => {
          obj[groupName] = obj[groupName] || {};
          obj = obj[groupName] as Record<string, unknown>;
        });
        obj.$type = resolvedType === 'COLOR' ? 'color' : 'number';

        if (isVariableAlias(value)) {
          const currentVar = await getVariableByIdAsync(value.id);
          obj.$value = `{${currentVar.name.replace(/\//g, '.')}}`;
        } else {
          obj.$value =
            resolvedType === 'COLOR' ? rgbToHex(value as RGB) : value;
        }
      }
    }
    files.push(file);
  }
  return files;
}
