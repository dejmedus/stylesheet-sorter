interface ICategories {
  [category: string]: string[];
}

interface IPropertiesMap {
  [property: string]: number;
}

interface IEditorConfig {
  indentSize: number;
  collapse: "collapse" | "expand";
  newline: boolean;
}

export { ICategories, IPropertiesMap, IEditorConfig };
