import { useEffect, useState } from "react";
import { pb, type PhotoRecord } from "../lib/pocketbase";
import { StarField } from "../components/StarField";
import { format } from "date-fns";
import { X } from "lucide-react";
import React from "react";

type RecentGalleryProps = {
  onPageChange: (page: string) => void;
};

export function RecentGallery({ onPageChange }: RecentGalleryProps) {
  const [medias, setMedias] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const resultList = await pb.collection("photos_astro").getList(1, 10, {
          sort: "-created",
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
        Chargement des photos...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        🌌 Galerie : 10 Dernières Observations
      </h1>

      <button
        onClick={() => onPageChange("Home")}
        className="mb-8 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <X className="w-5 h-5" />
        Retour à l'accueil
      </button>

      <div className="grid gap-10">
        {medias.map((photo) => (
          <div
            key={photo.id}
            className="bg-gray-900/50 p-4 rounded-lg shadow-md backdrop-blur-sm"
          >
            <img
              src={pb.files.getUrl(photo, photo.image)}
              alt={photo.titre}
              className="w-full h-auto rounded-lg mb-4"
            />

            <h2 className="text-xl font-semibold">{photo.titre}</h2>

            <p className="text-sm text-gray-400 mb-1">
              Observée le{" "}
              {new Date(photo.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {photo.objet && (
              <p className="text-sm text-gray-300">
                Objets :{" "}
                {Array.isArray(photo.objet)
                  ? photo.objet.join(", ")
                  : photo.objet}
              </p>
            )}

            {photo.monture && (
              <p className="text-sm text-gray-300">Monture : {photo.monture}</p>
            )}

            {photo.camera && (
              <p className="text-sm text-gray-300">Caméra : {photo.camera}</p>
            )}

            {photo.commentaire && (
              <p className="text-sm text-gray-200 mt-2">
                💬 Commentaire : {photo.commentaire}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
