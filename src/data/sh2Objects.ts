interface SH2Object {
  id: string;
  name: string;
  type: string;
  constellation: string;
  description: string;
}

export const sh2Objects: SH2Object[] = Array.from({ length: 313 }, (_, i) => {
  const number = (i + 1).toString().padStart(3, '0');
  return {
    id: `SH2-${number}`,
    name: `Sharpless ${number}`,
    type: "Région HII", // All Sharpless objects are HII regions
    constellation: "Unknown", // This would need to be populated with real data
    description: `Objet SH2-${number} du catalogue Sharpless, une région HII.`
  };
});