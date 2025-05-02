interface NGCObject {
  id: string;
  name: string;
  type: string;
  constellation: string;
  description: string;
}

export const ngcObjects: NGCObject[] = Array.from({ length: 7840 }, (_, i) => {
  const number = (i + 1).toString().padStart(4, '0');
  return {
    id: `NGC${number}`,
    name: `NGC ${number}`,
    type: "Unknown", // This would need to be populated with real data
    constellation: "Unknown", // This would need to be populated with real data
    description: `Object NGC ${number} from the New General Catalogue.`
  };
});