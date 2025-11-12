import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createImage,
  deleteImage,
  getImages,
  updateImage,
} from "../../services/imageService.js";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase/supabaseClient.js";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmDialog from "../common/ConfirmDialog";
import { toast } from "react-toastify";

const emptyForm = {
  descripcion: "",
  file: null,
};

function CuidadorImagenes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteConfirm = useConfirm();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const formTitle = useMemo(
    () => (editingId ? "Editar imagen" : "Nueva imagen"),
    [editingId]
  );

  async function fetchImages() {
    try {
      setLoading(true);
      setError("");
      const data = await getImages();
      setImages(data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las imagenes");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, files } = event.target;

    switch (name) {
      case "imageFile": {
        const file = files && files[0] ? files[0] : null;
        setFormData((prev) => ({ ...prev, file }));
        setSelectedFileName(file ? file.name : "");
        break;
      }
      default: {
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
      }
    }
  }

  function startEdit(image) {
    setEditingId(image.id);
    setFormData({
      descripcion: image.descripcion || "",
      url: image.url || "",
    });
    setSelectedFileName("");
    setFileInputKey((prev) => prev + 1);
  }

  function resetForm() {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setSelectedFileName("");
    setFileInputKey((prev) => prev + 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    //Obtenemos el grupo actual

    //Consultamos el grupoId asociado al usuario
    const { data: grupoData, error: grupoError } = await supabase
      .from("grupos")
      .select("id")
      .or(
        `medico_id.eq.${user.id},ciudador_id.eq.${user.id},paciente_id.eq.${user.id}`
      )
      .single();

    if (grupoError) {
      console.error(
        "Error obteniendo el grupo del usuario:",
        grupoError.message
      );
      setSaving(false);
      setError("No se pudo obtener el grupo del usuario");
      return;
    }

    const grupo_id = grupoData.id;

    try {
      if (editingId) {
        const updated = await updateImage(editingId, formData);
        setImages((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item))
        );
      } else {
        const created = await createImage({ ...formData, grupo_id });
        setImages((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Ocurrio un error al guardar la imagen");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(imageId) {
    deleteConfirm.openConfirm(imageId);
  }

  async function confirmDelete() {
    const imageId = deleteConfirm.data;
    try {
      await deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      if (editingId === imageId) {
        resetForm();
      }
      toast.success("Imagen eliminada correctamente");
    } catch (err) {
      setError(err.message || "No se pudo eliminar la imagen");
      toast.error(err.message || "No se pudo eliminar la imagen");
    } finally {
      deleteConfirm.closeConfirm();
    }
  }

  function toggleDescription(imageId) {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
              Panel de cuidador
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Administrar imagenes
            </h1>
            <p className="text-gray-600 mt-1">
              Crea, edita o elimina las imagenes utilizadas en los tests de
              memoria.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchImages}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              onClick={() => navigate("/dashboard/cuidador")}
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Volver al panel
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-max">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  {editingId ? "Modo edicion" : "Nueva imagen"}
                </p>
                <h2 className="text-xl font-semibold text-gray-900">
                  {formTitle}
                </h2>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Input de descripcion */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripcion
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  placeholder="Descripcion muy detallada de la imagen"
                />
              </div>

              {/* Input de archivo */}
              <div>
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subir imagen
                </label>
                <input
                  key={fileInputKey}
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  required={!formData.file && !editingId}
                  className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 transition file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 file:text-sm file:font-semibold hover:file:bg-blue-100"
                />
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <span className="block">
                    {selectedFileName
                      ? `Archivo seleccionado: ${selectedFileName}`
                      : "Formatos permitidos: JPG, PNG o GIF (max 5MB)."}
                  </span>
                  {editingId && formData.url && !selectedFileName && (
                    <span className="block">
                      Se conservara la imagen actual si no subes una nueva.
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar imagen"
                  : "Registrar imagen"}
              </button>
            </form>
          </div>

          {/* Listado */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col"
              style={{ maxHeight: "calc(100vh - 12rem)" }}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Galeria registrada
                  </h2>
                  <p className="text-sm text-gray-500">
                    {images.length} imagenes en total
                  </p>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-8 text-center text-sm text-gray-500">
                    Cargando imagenes...
                  </div>
                ) : images.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">
                    Aun no se han agregado imagenes. Usa el formulario para
                    crear la primera.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {images.map((image) => (
                      <li
                        key={image.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Imagen */}
                          <div className="flex-shrink-0">
                            <div className="h-32 w-32 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
                              {image.url ? (
                                <img
                                  src={image.url}
                                  alt={image.descripcion || "Imagen"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-gray-400 text-center px-2">
                                  Sin vista previa
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            {/* Descripción */}
                            <div className="flex-1">
                              <div className="relative">
                                <p
                                  className={`text-sm text-gray-900 leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 ${
                                    expandedDescriptions[image.id]
                                      ? ""
                                      : "line-clamp-3"
                                  }`}
                                >
                                  {image.descripcion || "Sin descripcion"}
                                </p>
                                {image.descripcion &&
                                  image.descripcion.length > 150 && (
                                    <button
                                      onClick={() =>
                                        toggleDescription(image.id)
                                      }
                                      className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                      {expandedDescriptions[image.id]
                                        ? "Ver menos"
                                        : "Ver más"}
                                    </button>
                                  )}
                              </div>
                            </div>

                            {/* Footer con fecha y acciones */}
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                              {image.created_at && (
                                <p className="text-xs text-gray-400">
                                  Registrada:{" "}
                                  {new Date(
                                    image.created_at
                                  ).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(image)}
                                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(image.id)}
                                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.closeConfirm}
        onConfirm={confirmDelete}
        title="Eliminar Imagen"
        message="Esta acción eliminará la imagen permanentemente. ¿Deseas continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

export default CuidadorImagenes;
