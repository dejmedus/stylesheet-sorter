interface ICategories {
  [category: string]: string[];
}

interface IPropertiesMap {
  [property: string]: number;
}

type Declaration = `${string}: ${string}`;

export { ICategories, IPropertiesMap, Declaration };
