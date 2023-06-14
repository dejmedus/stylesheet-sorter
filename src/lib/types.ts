export interface ICategories {
  [category: string]: string[];
}

export interface IPropertiesMap {
  [property: string]: number;
}

export interface IEditorConfig {
  indentSize: number;
  collapse: "collapse" | "expand";
  newline: boolean;
}
