import { useEffect, useState } from "react";
import { pb, type PhotoRecord } from "../lib/pocketbase";
import { Undo2 } from "lucide-react";
import React from "react";

export function RecentGallery({ onPageChange }: { onPageChange: (page: string) => void }) {
  const [medias, setMedias] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const resultList = await pb.collection("photos_astro").getList(1, 10, {
          sort: "-date",
          requestKey: null,
        });
        setMedias(resultList.items as PhotoRecord[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des médias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Chargement des médias...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        🌌 Galerie : 10 Dernières Observations
      </h1>

            <button
              onClick={() => onPageChange('home')}
              className="mb-8 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Undo2 className="w-5 h-5" />
              Retour à l'accueil
            </button>

      <div className="grid gap-10">
        {medias.map((media) => {
          const mediaUrl = pb.files.getUrl(media, media.image);

          return (
            <div
              key={media.id}
              className="bg-gray-900/50 p-4 rounded-lg shadow-x1/20 backdrop-blur-sm ring-2 ring-blue-500"
            >
              {media.mediaType === "video" ? (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-auto rounded-lg mb-4"
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              ) : (
                <img
                  src={mediaUrl}
                  alt={media.titre}
                  className="w-full h-auto rounded-lg mb-4"
                />
              )}

              <h2 className="text-xl font-semibold">{media.titre}</h2>

              <p className="text-sm text-gray-400 mb-1">
                Observée le{" "}
                {new Date(media.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {media.objet && (
                <p className="text-sm text-gray-300">
                  Objets :{" "}
                  {Array.isArray(media.objet)
                    ? media.objet.join(", ")
                    : media.objet}
                </p>
              )}

              {media.monture && (
                <p className="text-sm text-gray-300">Monture : {media.monture}</p>
              )}

              {media.camera && (
                <p className="text-sm text-gray-300">Caméra : {media.camera}</p>
              )}

              {media.commentaire && (
                <p className="text-sm text-gray-200 mt-2">
                  💬 Commentaire : {media.commentaire}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
