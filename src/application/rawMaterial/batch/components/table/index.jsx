import { useState } from "react";
import Loading from "application/common/animation/loading";
import {
  PencilSquareIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import capitalize from "@utils/capitalize";
import YesNoModal from "application/common/yesNoModal";
import PrintLabel from "application/components/printLabel";
import { deleteRawMaterialBatch } from "application/rawMaterial/batch/service";
import { toast } from "react-toastify";
import { logError } from "@utils/logError";
import EditRawMaterialBatchModal from "application/rawMaterial/batch/components/editModal";

export default function BatchTable({
  rawMaterialBatches = [],
  onChange,
  refresh,
  loading,
}) {
  const [showYesNoModal, setYesNoModal] = useState(false);
  const [batch, setBatch] = useState(null);
  const [printLabel, setPrintLabel] = useState(false);
  const [item, setItem] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  if (loading == true) {
    return <Loading />;
  } else if (rawMaterialBatches.length === 0) {
    return (
      <h3 className="text-center bg-white text-gray-500">
        no se encontró ningún registro
      </h3>
    );
  }

  const handleDelete = async () => {
    if (batch) {
      deleteRawMaterialBatch(batch?.id)
        .then((res) => {
          onChange(!refresh);
          toast.info("Lote de Materia Prima Eliminada");
        })
        .catch((err) => {
          logError(err);
        });
    }
  };
  return (
    <>
      <PrintLabel
        showModal={printLabel}
        item={item}
        onShowLabelChange={(value) => setPrintLabel(value)}
      />
      <YesNoModal
        showModal={showYesNoModal}
        message={"¿Desea Eliminar el Lote?"}
        onShowModalChange={(showModal) => setYesNoModal(showModal)}
        onYes={() => handleDelete()}
      />
      <EditRawMaterialBatchModal
        showModal={showEditModal}
        onShowModalChange={(showModal) => setShowEditModal(showModal)}
        batch={batch}
        onEdit={() => onChange(!refresh)}
      />
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-white text-gray-400 tracking-tight text-xs">
          <tr>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Fecha de entrada
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Materia Prima
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Lote
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Registrado por
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Bodega
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Fecha de expiración
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Cantidad ingresada
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Costo unitario
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Disponible
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase">
              Total
            </th>
            <th scope="col" className="py-3 font-extrabold uppercase"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rawMaterialBatches.map((rawMaterialBatch) => (
            <tr
              key={`RawMaterialBatch-item-${rawMaterialBatch.id}`}
              className="text-center text-sm text-gray-600 hover:bg-gray-100"
            >
              <td className="p-4 whitespace-nowrap">
                {rawMaterialBatch.entryDate}
              </td>
              <td className="p-4 whitespace-nowrap">
                {capitalize(rawMaterialBatch.rawMaterial.name)}
              </td>
              <td className="p-4 whitespace-nowrap">#{rawMaterialBatch.id}</td>
              <td className="p-4 whitespace-nowrap">
                {capitalize(rawMaterialBatch.employee.name)}{" "}
                {capitalize(rawMaterialBatch.employee.lastName)}
              </td>
              <td className="p-4 whitespace-nowrap">
                {capitalize(rawMaterialBatch.warehouse.name)}
              </td>
              <td className="p-4 whitespace-nowrap">
                {rawMaterialBatch.expirationDate}
              </td>
              <td className="p-4 whitespace-nowrap">
                {rawMaterialBatch.quantity}{" "}
                {rawMaterialBatch.rawMaterial.measurement}
              </td>
              <td className="p-4 whitespace-nowrap">
                ${rawMaterialBatch.unitCost}
              </td>
              <td className="p-4 whitespace-nowrap">
                {rawMaterialBatch.stock}{" "}
                {rawMaterialBatch.rawMaterial.measurement}
              </td>
              <td className="p-4 whitespace-nowrap">
                ${rawMaterialBatch.totalCost}
              </td>
              <td className="p-4 whitespace-nowrap">
                <div className="flex justify-center">
                  <div
                    onClick={() => {
                      setItem({
                        id: rawMaterialBatch.id,
                        name: rawMaterialBatch.rawMaterial.name,
                        time: rawMaterialBatch.createdAt,
                      });
                      setPrintLabel(true);
                    }}
                    className="flex items-center text-blue-500 mr-3 hover:scale-110 cursor-default transition-transform"
                  >
                    <PrinterIcon className="w-4 mr-1" />
                    Imprimir
                  </div>
                  <div
                    onClick={() => {
                      setBatch(rawMaterialBatch);
                      setShowEditModal(true);
                    }}
                    className="flex items-center mr-3 hover:scale-110 cursor-default transition-transform"
                  >
                    <PencilSquareIcon className="w-4 mr-1" />
                    Editar
                  </div>
                  <div
                    onClick={() => {
                      setYesNoModal(true);
                      setBatch(rawMaterialBatch);
                    }}
                    className="flex items-center text-red-500 hover:scale-105 cursor-default transition-transform"
                  >
                    <TrashIcon className="w-4 mr-1" />
                    Eliminar
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
