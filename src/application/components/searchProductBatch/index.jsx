import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { getAllProductBatchesByBarcode } from "application/product/service";
import { logError } from "@utils/logError";
import capitalize from "@utils/capitalize";
import Loading from "application/common/animation/loading";

export default function SearchProductBatch({
  showModal,
  onShowModalChange,
  onClick,
}) {
  const [batches, setBatches] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);

  if (showModal === false) return <></>;

  async function handleKeyPress(e) {
    const key = e.keyCode || e.which;
    if (key == 13) {
      e.preventDefault();
      setLoading(true);
      getAllProductBatchesByBarcode(barcode)
        .then((result) => {
          console.log(result);
          setBatches(result);
        })
        .catch((error) => {
          logError(error);
        })
        .finally(() => {
          setBarcode("");
          setLoading(false);
        });
    }
  }

  const handleClose = () => {
    setBarcode("");
    onShowModalChange(false);
  };

  const handleClick = (value) => {
    onClick(value);
    handleClose();
  };

  return (
    <section className="z-50 fixed inset-0 flex items-center justify-center overflow-y-auto bg-beereign_bg bg-opacity-80">
      <div className="px-4 w-full max-w-md overflow-x-auto max-h-screen sm:max-w-xl md:max-w-3xl md:h-auto">
        <div className="relative bg-white rounded-2xl shadow-lg pb-4">
          <div className="flex justify-between items-start p-5 rounded-t border-b">
            <div>
              <h3 className="font-medium text-lg">Buscar lote de producto</h3>
              <p className="pt-2 text-sm text-gray-400">
                Escanee con un lector de códigos de barra o seleccione el # de
                lote a continuación.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-2xl text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <XMarkIcon className="w-5" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <input
              type="search"
              autoFocus
              className="appearance-none block w-full text-gray-900 focus:ring-yellow-100 focus:border-beereign_yellow shadow-sm border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
              placeholder="Escanear Código de Barra..."
              onKeyPress={handleKeyPress}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </div>
          <div className="h-64 max-h-64 overflow-y-auto mx-2 rounded-b-2xl">
            {loading === false ? (
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase lg:p-5"
                    >
                      Lote
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase lg:p-5"
                    >
                      Bodega
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase lg:p-5"
                    >
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batches.map((batch) => (
                    <tr
                      key={`product-batch-${batch.id}`}
                      className="hover:bg-gray-100"
                      onClick={() => handleClick(batch)}
                    >
                      <td className="p-4 text-sm font-mono text-gray-500 whitespace-nowrap lg:p-5">
                        #{batch.id}
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap lg:p-5">
                        {capitalize(batch.packing.warehouse.name)}
                      </td>
                      <td className="p-4 text-sm font-mono text-gray-500 whitespace-nowrap lg:p-5">
                        {batch.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
