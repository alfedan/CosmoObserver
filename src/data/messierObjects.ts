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
    constellation: "Taureau"
  },
  {
    id: "M2",
    name: "Amas globulaire M2",
    description: "M2 est l'un des plus grands et des plus brillants amas globulaires du ciel. Il contient environ 150 000 étoiles et est âgé d'environ 13 milliards d'années.",
    type: "Amas globulaire",
    constellation: "Verseau"
  },
  {
    id: "M3",
    name: "Amas globulaire M3",
    description: "Un des plus beaux amas globulaires visibles depuis l'hémisphère nord. Il contient environ un demi-million d'étoiles.",
    type: "Amas globulaire",
    constellation: "Chiens de chasse"
  },
  {
    id: "M4",
    name: "Amas globulaire M4",
    description: "Un des amas globulaires les plus proches de nous, situé à environ 7200 années-lumière. Il est facilement visible à l'œil nu dans de bonnes conditions.",
    type: "Amas globulaire",
    constellation: "Scorpion"
  },
  {
    id: "M5",
    name: "Amas globulaire M5",
    description: "L'un des plus anciens amas globulaires connus, estimé à 13 milliards d'années. Il contient plus de 100 000 étoiles.",
    type: "Amas globulaire",
    constellation: "Serpent"
  },
  {
    id: "M6",
    name: "Amas du Papillon",
    description: "Un amas ouvert contenant environ 80 étoiles. Son nom vient de la forme apparente de ses étoiles les plus brillantes qui évoquent un papillon.",
    type: "Amas ouvert",
    constellation: "Scorpion"
  },
  {
    id: "M7",
    name: "Amas de Ptolémée",
    description: "L'un des amas ouverts les plus brillants et visibles à l'œil nu. Il contient environ 80 étoiles dans un diamètre de 25 années-lumière.",
    type: "Amas ouvert",
    constellation: "Scorpion"
  },
  {
    id: "M8",
    name: "Nébuleuse de la Lagune",
    description: "Une vaste nébuleuse en émission contenant une région HII où se forment activement des étoiles. Son nom vient des bandes sombres qui divisent sa brillante région centrale.",
    type: "Nébuleuse",
    constellation: "Sagittaire"
  },
  {
    id: "M9",
    name: "Amas globulaire M9",
    description: "L'un des amas globulaires les plus proches du centre galactique, situé à environ 25 700 années-lumière de la Terre.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M10",
    name: "Amas globulaire M10",
    description: "Un amas globulaire dense situé à environ 14 300 années-lumière de la Terre avec un diamètre d'environ 83 années-lumière.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M11",
    name: "Amas du Canard Sauvage",
    description: "L'un des amas ouverts les plus riches et les plus compacts, contenant environ 2900 étoiles.",
    type: "Amas ouvert",
    constellation: "Écu de Sobieski"
  },
  {
    id: "M12",
    name: "Amas globulaire M12",
    description: "Un amas globulaire de taille moyenne, situé à environ 16 000 années-lumière de la Terre.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M13",
    name: "Grand Amas d'Hercule",
    description: "L'un des amas globulaires les plus remarquables de l'hémisphère nord, contenant environ 300 000 étoiles.",
    type: "Amas globulaire",
    constellation: "Hercule"
  },
  {
    id: "M14",
    name: "Amas globulaire M14",
    description: "Un amas globulaire contenant plusieurs centaines de milliers d'étoiles, situé à environ 30 000 années-lumière.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M15",
    name: "Amas globulaire M15",
    description: "L'un des amas globulaires les plus denses connus, avec un possible trou noir en son centre. Il contient plus de 100 000 étoiles.",
    type: "Amas globulaire",
    constellation: "Pégase"
  },
  {
    id: "M16",
    name: "Nébuleuse de l'Aigle",
    description: "Une jeune région de formation d'étoiles, connue pour ses 'Piliers de la Création'. Elle contient un amas ouvert d'étoiles né de cette nébuleuse.",
    type: "Nébuleuse avec amas ouvert",
    constellation: "Serpent"
  },
  {
    id: "M17",
    name: "Nébuleuse Oméga",
    description: "Une des nébuleuses en émission les plus brillantes du ciel, également appelée nébuleuse du Cygne ou du Fer à Cheval en raison de sa forme.",
    type: "Nébuleuse",
    constellation: "Sagittaire"
  },
  {
    id: "M18",
    name: "Amas ouvert M18",
    description: "Un amas ouvert relativement faible contenant environ 20 étoiles visibles au télescope.",
    type: "Amas ouvert",
    constellation: "Sagittaire"
  },
  {
    id: "M19",
    name: "Amas globulaire M19",
    description: "L'un des amas globulaires les plus aplatis connus, probablement en raison de sa proximité avec le centre galactique.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M20",
    name: "Nébuleuse Trifide",
    description: "Une nébuleuse à la fois en émission et en réflexion, divisée en trois lobes par des bandes de poussière, d'où son nom.",
    type: "Nébuleuse",
    constellation: "Sagittaire"
  },
  {
    id: "M21",
    name: "Amas ouvert M21",
    description: "Un amas ouvert compact comprenant environ 57 étoiles dans une région de 13 années-lumière de diamètre.",
    type: "Amas ouvert",
    constellation: "Sagittaire"
  },
  {
    id: "M22",
    name: "Amas globulaire M22",
    description: "Un des amas globulaires les plus brillants et l'un des premiers découverts. Il contient environ 70 000 étoiles.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M23",
    name: "Amas ouvert M23",
    description: "Un amas ouvert contenant environ 150 étoiles réparties sur un diamètre de 15-20 années-lumière.",
    type: "Amas ouvert",
    constellation: "Sagittaire"
  },
  {
    id: "M24",
    name: "Nuage stellaire du Sagittaire",
    description: "Ce n'est pas un véritable objet du ciel profond mais plutôt un patch de la Voie lactée particulièrement dense en étoiles.",
    type: "Nuage stellaire",
    constellation: "Sagittaire"
  },
  {
    id: "M25",
    name: "Amas ouvert M25",
    description: "Un amas ouvert comportant environ 30 étoiles visibles dans un télescope d'amateur.",
    type: "Amas ouvert",
    constellation: "Sagittaire"
  },
  {
    id: "M26",
    name: "Amas ouvert M26",
    description: "Un amas ouvert compact situé à environ 5 000 années-lumière de la Terre, contenant environ 90 membres.",
    type: "Amas ouvert",
    constellation: "Écu de Sobieski"
  },
  {
    id: "M27",
    name: "Nébuleuse de l'Haltère",
    description: "Une des nébuleuses planétaires les plus brillantes et les plus faciles à observer. Elle est le résultat de l'expulsion des couches externes d'une étoile en fin de vie.",
    type: "Nébuleuse planétaire",
    constellation: "Petit Renard"
  },
  {
    id: "M28",
    name: "Amas globulaire M28",
    description: "Un amas globulaire modérément brillant situé près du centre de notre galaxie, à environ 18 000 années-lumière de la Terre.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M29",
    name: "Amas ouvert M29",
    description: "Un petit amas ouvert formé d'une vingtaine d'étoiles disposées en forme de croix.",
    type: "Amas ouvert",
    constellation: "Cygne"
  },
  {
    id: "M30",
    name: "Amas globulaire M30",
    description: "Un amas globulaire dense qui présente un noyau compact, résultat d'un effondrement gravitationnel.",
    type: "Amas globulaire",
    constellation: "Capricorne"
  },
  {
    id: "M31",
    name: "Galaxie d'Andromède",
    description: "La galaxie spirale la plus proche de la nôtre et l'objet le plus lointain visible à l'œil nu. Elle contient environ 1 000 milliards d'étoiles.",
    type: "Galaxie spirale",
    constellation: "Andromède"
  },
  {
    id: "M32",
    name: "Galaxie satellite M32",
    description: "Une petite galaxie elliptique satellite de la galaxie d'Andromède (M31).",
    type: "Galaxie elliptique naine",
    constellation: "Andromède"
  },
  {
    id: "M33",
    name: "Galaxie du Triangle",
    description: "Une galaxie spirale membre du Groupe local, située à environ 3 millions d'années-lumière. C'est l'un des objets les plus lointains visibles à l'œil nu.",
    type: "Galaxie spirale",
    constellation: "Triangle"
  },
  {
    id: "M34",
    name: "Amas ouvert M34",
    description: "Un amas ouvert assez brillant contenant environ 100 étoiles réparties sur un diamètre de 35 années-lumière.",
    type: "Amas ouvert",
    constellation: "Persée"
  },
  {
    id: "M35",
    name: "Amas ouvert M35",
    description: "Un grand amas ouvert visible à l'œil nu dans de bonnes conditions. Il contient plusieurs centaines d'étoiles.",
    type: "Amas ouvert",
    constellation: "Gémeaux"
  },
  {
    id: "M36",
    name: "Amas du Pingouin",
    description: "Un amas ouvert jeune comprenant environ 60 étoiles, similaire aux Pléiades mais plus compact.",
    type: "Amas ouvert",
    constellation: "Cocher"
  },
  {
    id: "M37",
    name: "Amas ouvert M37",
    description: "Le plus riche et le plus brillant des trois amas ouverts du Cocher dans le catalogue Messier. Il contient environ 500 étoiles.",
    type: "Amas ouvert",
    constellation: "Cocher"
  },
  {
    id: "M38",
    name: "Amas de la lettre Pi",
    description: "Un amas ouvert contenant environ 100 étoiles dont l'arrangement rappelle la lettre grecque Pi (π).",
    type: "Amas ouvert",
    constellation: "Cocher"
  },
  {
    id: "M39",
    name: "Amas ouvert M39",
    description: "Un amas ouvert assez dispersé comprenant une quarantaine d'étoiles brillantes réparties sur environ 7 années-lumière.",
    type: "Amas ouvert",
    constellation: "Cygne"
  },
  {
    id: "M40",
    name: "Winnecke 4",
    description: "Ce n'est pas un véritable objet du ciel profond mais une étoile double que Messier a incluse par erreur dans son catalogue.",
    type: "Étoile double",
    constellation: "Grande Ourse"
  },
  {
    id: "M41",
    name: "Petit Essaim d'Abeilles",
    description: "Un amas ouvert visible à l'œil nu dans de bonnes conditions, situé à environ 2 300 années-lumière.",
    type: "Amas ouvert",
    constellation: "Grand Chien"
  },
  {
    id: "M42",
    name: "Nébuleuse d'Orion",
    description: "La nébuleuse diffuse la plus brillante du ciel et visible à l'œil nu. C'est une immense nurserie stellaire où se forment activement des étoiles.",
    type: "Nébuleuse diffuse",
    constellation: "Orion"
  },
  {
    id: "M43",
    name: "Nébuleuse De Mairan",
    description: "Une partie de la nébuleuse d'Orion, séparée par une bande de poussière sombre.",
    type: "Nébuleuse diffuse",
    constellation: "Orion"
  },
  {
    id: "M44",
    name: "Amas de la Crèche",
    description: "Un des amas ouverts les plus proches de nous, visible à l'œil nu comme une tache floue. Aussi appelé Praesepe ou la Ruche.",
    type: "Amas ouvert",
    constellation: "Cancer"
  },
  {
    id: "M45",
    name: "Les Pléiades",
    description: "Le plus brillant amas ouvert du ciel, facilement visible à l'œil nu. C'est un jeune amas d'étoiles bleues enveloppées de nébuleuses à réflexion.",
    type: "Amas ouvert",
    constellation: "Taureau"
  },
  {
    id: "M46",
    name: "Amas ouvert M46",
    description: "Un riche amas ouvert contenant environ 500 étoiles et abritant une nébuleuse planétaire en son sein.",
    type: "Amas ouvert",
    constellation: "Poupe"
  },
  {
    id: "M47",
    name: "Amas ouvert M47",
    description: "Un amas ouvert brillant et dispersé, situé près de M46 mais plus facile à observer aux jumelles.",
    type: "Amas ouvert",
    constellation: "Poupe"
  },
  {
    id: "M48",
    name: "Amas ouvert M48",
    description: "Un grand amas ouvert contenant environ 80 étoiles réparties sur une zone de 30 années-lumière.",
    type: "Amas ouvert",
    constellation: "Hydre"
  },
  {
    id: "M49",
    name: "Galaxie elliptique M49",
    description: "Une des galaxies les plus brillantes de l'amas de la Vierge et la première galaxie découverte en dehors du Groupe local.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M50",
    name: "Amas du Cœur",
    description: "Un amas ouvert dont la forme rappelle un cœur, contenant environ 200 étoiles.",
    type: "Amas ouvert",
    constellation: "Licorne"
  },
  {
    id: "M51",
    name: "Galaxie du Tourbillon",
    description: "Une galaxie spirale classique en interaction avec une galaxie naine voisine. Elle est connue pour ses bras spiraux bien définis.",
    type: "Galaxie spirale",
    constellation: "Chiens de chasse"
  },
  {
    id: "M52",
    name: "Amas ouvert M52",
    description: "Un amas ouvert riche contenant environ 200 étoiles dans un diamètre de 19 années-lumière.",
    type: "Amas ouvert",
    constellation: "Cassiopée"
  },
  {
    id: "M53",
    name: "Amas globulaire M53",
    description: "Un amas globulaire assez brillant situé à environ 60 000 années-lumière du centre galactique.",
    type: "Amas globulaire",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M54",
    name: "Amas globulaire M54",
    description: "Initialement considéré comme un amas globulaire de notre galaxie, mais appartenant en réalité à la galaxie naine du Sagittaire.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M55",
    name: "Amas globulaire M55",
    description: "Un amas globulaire large et peu dense, facilement résolu en étoiles même avec un petit télescope.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M56",
    name: "Amas globulaire M56",
    description: "Un amas globulaire assez compact situé à mi-chemin entre les étoiles Albireo et Gamma Lyrae.",
    type: "Amas globulaire",
    constellation: "Lyre"
  },
  {
    id: "M57",
    name: "Nébuleuse de l'Anneau",
    description: "Une célèbre nébuleuse planétaire en forme d'anneau, créée par une étoile mourante qui a expulsé ses couches externes.",
    type: "Nébuleuse planétaire",
    constellation: "Lyre"
  },
  {
    id: "M58",
    name: "Galaxie spirale barrée M58",
    description: "Une des galaxies spirales barrées les plus brillantes de l'amas de la Vierge.",
    type: "Galaxie spirale barrée",
    constellation: "Vierge"
  },
  {
    id: "M59",
    name: "Galaxie elliptique M59",
    description: "Une galaxie elliptique de l'amas de la Vierge, plus petite et moins lumineuse que sa voisine M60.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M60",
    name: "Galaxie elliptique M60",
    description: "Une grande galaxie elliptique de l'amas de la Vierge, en interaction avec la galaxie spirale NGC 4647.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M61",
    name: "Galaxie spirale M61",
    description: "Une grande galaxie spirale face-on dans l'amas de la Vierge, connue pour sa forte activité de formation d'étoiles et ses supernovas.",
    type: "Galaxie spirale",
    constellation: "Vierge"
  },
  {
    id: "M62",
    name: "Amas globulaire M62",
    description: "Un amas globulaire très dense et irrégulier, situé près du centre galactique.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M63",
    name: "Galaxie du Tournesol",
    description: "Une galaxie spirale avec des bras très enroulés qui lui donnent l'apparence d'un tournesol.",
    type: "Galaxie spirale",
    constellation: "Chiens de chasse"
  },
  {
    id: "M64",
    name: "Galaxie de l'Œil noir",
    description: "Une galaxie spirale avec une bande de poussière sombre caractéristique devant son noyau brillant, rappelant un œil au globe noir.",
    type: "Galaxie spirale",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M65",
    name: "Galaxie M65",
    description: "Une des trois galaxies spirales du Triplet du Lion, vue presque de profil.",
    type: "Galaxie spirale",
    constellation: "Lion"
  },
 {
    id: "M66",
    name: "Galaxie M66",
    description: "La plus grande et la plus brillante des trois galaxies du Triplet du Lion. Elle présente une structure spirale déformée par l'interaction gravitationnelle avec ses voisines.",
    type: "Galaxie spirale",
    constellation: "Lion"
  },
  {
    id: "M67",
    name: "Amas ouvert M67",
    description: "L'un des plus anciens amas ouverts connus, avec un âge estimé à 4 milliards d'années. Il contient environ 500 étoiles.",
    type: "Amas ouvert",
    constellation: "Cancer"
  },
  {
    id: "M68",
    name: "Amas globulaire M68",
    description: "Un amas globulaire relativement petit et distant, situé à environ 33 000 années-lumière de la Terre.",
    type: "Amas globulaire",
    constellation: "Hydre"
  },
  {
    id: "M69",
    name: "Amas globulaire M69",
    description: "Un amas globulaire compact et dense situé près du centre galactique.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M70",
    name: "Amas globulaire M70",
    description: "Un petit amas globulaire dense, similaire et proche de M69, situé à environ 29 000 années-lumière.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M71",
    name: "Amas globulaire M71",
    description: "Longtemps considéré comme un amas ouvert dense, il est maintenant classé comme un amas globulaire peu concentré.",
    type: "Amas globulaire",
    constellation: "Flèche"
  },
  {
    id: "M72",
    name: "Amas globulaire M72",
    description: "Un amas globulaire distant et relativement petit, situé à environ 55 000 années-lumière.",
    type: "Amas globulaire",
    constellation: "Verseau"
  },
  {
    id: "M73",
    name: "Amas stellaire M73",
    description: "Un petit groupe d'étoiles longtemps considéré comme un amas ouvert, mais qui serait plutôt un astérisme (groupe d'étoiles alignées par hasard sur notre ligne de visée).",
    type: "Astérisme",
    constellation: "Verseau"
  },
  {
    id: "M74",
    name: "Galaxie du Poisson",
    description: "Une galaxie spirale face-on de type grand design, avec des bras spiraux parfaitement définis mais de faible luminosité.",
    type: "Galaxie spirale",
    constellation: "Poissons"
  },
  {
    id: "M75",
    name: "Amas globulaire M75",
    description: "Un des amas globulaires les plus compacts et les plus denses du catalogue Messier, situé à environ 67 500 années-lumière.",
    type: "Amas globulaire",
    constellation: "Sagittaire"
  },
  {
    id: "M76",
    name: "Petite Nébuleuse de l'Haltère",
    description: "Une nébuleuse planétaire surnommée ainsi en raison de sa ressemblance avec M27, mais plus petite et plus faible.",
    type: "Nébuleuse planétaire",
    constellation: "Persée"
  },
  {
    id: "M77",
    name: "Galaxie de Cetus",
    description: "Une galaxie spirale abritant un noyau actif de galaxie (AGN) de type Seyfert, l'une des plus brillantes du catalogue.",
    type: "Galaxie spirale",
    constellation: "Baleine"
  },
  {
    id: "M78",
    name: "Nébuleuse de réflexion M78",
    description: "La plus brillante nébuleuse à réflexion du ciel, illuminée par les jeunes étoiles qu'elle contient.",
    type: "Nébuleuse à réflexion",
    constellation: "Orion"
  },
  {
    id: "M79",
    name: "Amas globulaire M79",
    description: "Un amas globulaire compact et brillant qui pourrait être originaire de la galaxie naine du Grand Chien en cours d'absorption par notre Voie lactée.",
    type: "Amas globulaire",
    constellation: "Lièvre"
  },
  {
    id: "M80",
    name: "Amas globulaire M80",
    description: "L'un des amas globulaires les plus denses de notre galaxie, contenant des centaines de milliers d'étoiles.",
    type: "Amas globulaire",
    constellation: "Scorpion"
  },
  {
    id: "M81",
    name: "Galaxie de Bode",
    description: "Une des galaxies spirales les plus brillantes du ciel, avec une structure parfaitement définie, en interaction avec M82.",
    type: "Galaxie spirale",
    constellation: "Grande Ourse"
  },
  {
    id: "M82",
    name: "Galaxie du Cigare",
    description: "Une galaxie irrégulière vue par la tranche avec d'intenses régions de formation d'étoiles. Son aspect tubulaire lui vaut son surnom.",
    type: "Galaxie irrégulière",
    constellation: "Grande Ourse"
  },
  {
    id: "M83",
    name: "Galaxie du Moulinet du Sud",
    description: "Une galaxie spirale barrée face-on avec des bras spiraux très prononcés et des régions actives de formation d'étoiles.",
    type: "Galaxie spirale barrée",
    constellation: "Hydre"
  },
  {
    id: "M84",
    name: "Galaxie elliptique M84",
    description: "Une galaxie lenticulaire ou elliptique massive située au cœur de l'amas de la Vierge.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M85",
    name: "Galaxie lenticulaire M85",
    description: "La galaxie la plus septentrionale de l'amas de la Vierge, de type lenticulaire avec une barre faible.",
    type: "Galaxie lenticulaire",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M86",
    name: "Galaxie elliptique M86",
    description: "Une galaxie lenticulaire ou elliptique de l'amas de la Vierge, qui se déplace rapidement vers nous.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M87",
    name: "Galaxie Virgo A",
    description: "Une galaxie elliptique géante au centre de l'amas de la Vierge, abritant un trou noir supermassif photographié pour la première fois en 2019.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M88",
    name: "Galaxie spirale M88",
    description: "Une galaxie spirale classique de l'amas de la Vierge, légèrement inclinée par rapport à notre ligne de visée.",
    type: "Galaxie spirale",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M89",
    name: "Galaxie elliptique M89",
    description: "Une galaxie elliptique presque parfaitement sphérique dans l'amas de la Vierge, entourée d'un halo étendu.",
    type: "Galaxie elliptique",
    constellation: "Vierge"
  },
  {
    id: "M90",
    name: "Galaxie spirale M90",
    description: "Une des plus grandes et des plus brillantes galaxies spirales de l'amas de la Vierge, avec peu de formation stellaire active.",
    type: "Galaxie spirale",
    constellation: "Vierge"
  },
  {
    id: "M91",
    name: "Galaxie spirale barrée M91",
    description: "Une galaxie spirale barrée de l'amas de la Vierge, longtemps mal identifiée en raison d'une erreur de Messier.",
    type: "Galaxie spirale barrée",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M92",
    name: "Amas globulaire M92",
    description: "Un des amas globulaires les plus brillants et les plus anciens de notre galaxie, souvent éclipsé par le voisin M13.",
    type: "Amas globulaire",
    constellation: "Hercule"
  },
  {
    id: "M93",
    name: "Amas ouvert M93",
    description: "Un amas ouvert brillant et compact contenant environ 80 étoiles dans une configuration triangulaire.",
    type: "Amas ouvert",
    constellation: "Poupe"
  },
  {
    id: "M94",
    name: "Galaxie spirale M94",
    description: "Une galaxie spirale compacte avec un noyau interne très brillant entouré d'un anneau actif de formation d'étoiles.",
    type: "Galaxie spirale",
    constellation: "Chiens de chasse"
  },
  {
    id: "M95",
    name: "Galaxie spirale barrée M95",
    description: "Une galaxie spirale barrée du groupe du Lion, caractérisée par un anneau de formation d'étoiles entourant son centre.",
    type: "Galaxie spirale barrée",
    constellation: "Lion"
  },
  {
    id: "M96",
    name: "Galaxie spirale M96",
    description: "La galaxie principale du groupe du Lion, avec une structure spirale asymétrique probablement due à l'interaction gravitationnelle.",
    type: "Galaxie spirale",
    constellation: "Lion"
  },
  {
    id: "M97",
    name: "Nébuleuse du Hibou",
    description: "Une nébuleuse planétaire dont la structure rappelle un hibou aux yeux ronds, résultat de l'expulsion des couches externes d'une étoile.",
    type: "Nébuleuse planétaire",
    constellation: "Grande Ourse"
  },
  {
    id: "M98",
    name: "Galaxie spirale M98",
    description: "Une galaxie spirale vue presque par la tranche, se déplaçant vers nous à grande vitesse.",
    type: "Galaxie spirale",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M99",
    name: "Galaxie du Moulinet",
    description: "Une galaxie spirale face-on avec un bras spiral déformé, probablement suite à l'interaction avec une autre galaxie.",
    type: "Galaxie spirale",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M100",
    name: "Galaxie spirale M100",
    description: "Une des galaxies spirales les plus brillantes de l'amas de la Vierge, avec une structure grand design et de nombreuses régions HII.",
    type: "Galaxie spirale",
    constellation: "Chevelure de Bérénice"
  },
  {
    id: "M101",
    name: "Galaxie du Moulinet",
    description: "Une grande galaxie spirale face-on avec une structure symétrique parfaite, située à environ 27 millions d'années-lumière.",
    type: "Galaxie spirale",
    constellation: "Grande Ourse"
  },
  {
    id: "M102",
    name: "Galaxie du Fuseau",
    description: "Probablement une observation dupliquée de M101, bien que certains l'identifient à la galaxie du Fuseau (NGC 5866).",
    type: "Galaxie lenticulaire",
    constellation: "Dragon"
  },
  {
    id: "M103",
    name: "Amas ouvert M103",
    description: "Un jeune amas ouvert de forme triangulaire contenant environ 40 étoiles sur une distance de 15 années-lumière.",
    type: "Amas ouvert",
    constellation: "Cassiopée"
  },
  {
    id: "M104",
    name: "Galaxie du Sombrero",
    description: "Une galaxie spirale vue par la tranche avec un bulbe central proéminent et une bande de poussière bien définie, évoquant un chapeau mexicain.",
    type: "Galaxie spirale",
    constellation: "Vierge"
  },
  {
    id: "M105",
    name: "Galaxie elliptique M105",
    description: "Une galaxie elliptique brillante du groupe du Lion, formant un trio avec NGC 3384 et NGC 3389.",
    type: "Galaxie elliptique",
    constellation: "Lion"
  },
  {
    id: "M106",
    name: "Galaxie spirale M106",
    description: "Une galaxie spirale avec un noyau actif (de type Seyfert) et des bras spiraux supplémentaires émettant des rayons X.",
    type: "Galaxie spirale",
    constellation: "Chiens de chasse"
  },
  {
    id: "M107",
    name: "Amas globulaire M107",
    description: "Un des amas globulaires les moins denses et les plus irréguliers du catalogue, situé à environ 20 000 années-lumière.",
    type: "Amas globulaire",
    constellation: "Ophiuchus"
  },
  {
    id: "M108",
    name: "Galaxie spirale M108",
    description: "Une galaxie spirale vue par la tranche, présentant une structure irrégulière avec des régions de poussière sombre et de formation d'étoiles.",
    type: "Galaxie spirale",
    constellation: "Grande Ourse"
  },
  {
    id: "M109",
    name: "Galaxie spirale barrée M109",
    description: "Une galaxie spirale barrée avec des bras spiraux asymétriques et un anneau interne autour de la barre centrale.",
    type: "Galaxie spirale barrée",
    constellation: "Grande Ourse"
  },
  {
    id: "M110",
    name: "Galaxie elliptique naine M110",
    description: "Une galaxie elliptique naine satellite de la galaxie d'Andromède (M31). Elle est en réalité le second compagnon de M31 avec M32.",
    type: "Galaxie elliptique naine",
    constellation: "Andromède"
  }
];