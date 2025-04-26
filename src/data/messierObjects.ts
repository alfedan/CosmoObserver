interface MessierObject {
  id: string;
  name: string;
  description: string;
  type: string;
  constellation: string;
  imageUrl: string;
}

export const messierObjects: MessierObject[] = [
  {
    id: "M1",
    name: "Nébuleuse du Crabe",
    description: "C'est une nébuleuse de vent de pulsar et un rémanent de supernova de la constellation du Taureau, du bras de Persée de la Voie lactée. Elle résulte, avec son pulsar du Crabe central, de l'explosion de l'étoile massive SN 1054 en supernova historique.",
    type: "Nébuleuse",
    constellation: "Taureau",
    imageUrl: "https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg"
  },
  {
    id: "M2",
    name: "Amas globulaire M2",
    description: "M2 est l'un des plus grands et des plus brillants amas globulaires du ciel. Il contient environ 150 000 étoiles et est âgé d'environ 13 milliards d'années.",
    type: "Amas globulaire",
    constellation: "Verseau",
    imageUrl: "https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg"
  },
  {
    id: "M3",
    name: "Amas globulaire M3",
    description: "Un des plus beaux amas globulaires visibles depuis l'hémisphère nord. Il contient environ un demi-million d'étoiles.",
    type: "Amas globulaire",
    constellation: "Chiens de chasse",
    imageUrl: "https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg"
  }
];