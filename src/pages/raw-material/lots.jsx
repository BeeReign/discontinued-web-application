import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HomeIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";

import { getRawMaterialBatches } from "application/rawMaterial/batch/service";
import { getRawMaterialByCode } from "application/rawMaterial/service";
import { logError } from "@utils/logError";
import CheckPermission from "@utils/checkPermission";
const BatchTable = dynamic(() =>
  import("application/rawMaterial/batch/components/table")
);
const Pagination = dynamic(() =>
  import("application/common/pagination/normal")
);
const SearchRawMaterial = dynamic(() =>
  import("application/components/searchRawMaterial")
);

export default function Index() {
  CheckPermission("/raw-material");
  const [rawMaterialBatches, setBatches] = useState([]);
  const [rawMaterial, setRawMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("ASC");
  const [type, setType] = useState("inStock");
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState(false);
  const [RMQ, setRMQ] = useState("");

  useEffect(() => {
    const loadBatches = async () => {
      setLoading(true);
      getRawMaterialBatches(
        limit,
        page,
        order,
        type,
        rawMaterial ? rawMaterial?.id : rawMaterial
      )
        .then((result) => {
          setBatches(result);
        })
        .catch((error) => {
          logError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    loadBatches();
  }, [page, limit, order, type, refresh, rawMaterial]);

  const totalPages = Math.ceil(rawMaterialBatches?.count / limit);

  async function handleKeyPress(e) {
    const key = e.keyCode || e.which;
    if (key == 13) {
      e.preventDefault();
      getRawMaterialByCode(RMQ.toLowerCase())
        .then((result) => {
          setRawMaterial(result);
        })
        .catch((err) => {
          logError(err);
        })
        .finally(() => {
          setRMQ("");
        });
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Lotes de Materia Prima</title>
      </Head>
      <SearchRawMaterial
        showModal={search}
        onClick={(value) => setRawMaterial(value)}
        onShowModalChange={(value) => setSearch(value)}
      />
      <section className="block justify-between items-center p-4 mx-4 mb-6 bg-white rounded-2xl shadow-xl shadow-gray-200 lg:p-5 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <nav className="flex mb-5" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    href="/home"
                    className="inline-flex items-center text-gray-700 hover:text-beereign_yellow cursor-default"
                  >
                    <HomeIcon className="w-5 mr-5" />
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon className="w-4 text-gray-400" />
                    <div className="ml-1 md:ml-2">
                      <Link
                        href="/raw-material"
                        className="inline-flex items-center text-gray-700 hover:text-beereign_yellow cursor-default"
                      >
                        Materia Prima
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon className="w-4 text-gray-400" />
                    <div className="ml-1 font-medium text-gray-400 md:ml-2 cursor-default">
                      Lotes
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Lotes de materia prima
            </h1>
          </div>
          <div className="block items-center sm:flex md:divide-x md:divide-gray-100">
            <div className="mb-4 sm:pr-3 sm:mb-0">
              <div className="relative mt-1 sm:w-64 xl:w-96 flex">
                {rawMaterial ? (
                  <TrashIcon
                    className="w-12 text-red-600 hover:scale-105 transition-transform"
                    onClick={() => setRawMaterial(null)}
                  />
                ) : (
                  <></>
                )}
                <input
                  type="search"
                  value={RMQ}
                  autoFocus
                  onChange={(e) => setRMQ(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-yellow-50 focus:border-beereign_yellow block w-full p-2.5 focus:outline-none"
                  placeholder={
                    rawMaterial ? rawMaterial.name : "Esperando scanner..."
                  }
                />
                <TableCellsIcon
                  className="w-12 text-gray-700 hover:text-beereign_yellow"
                  onClick={() => setSearch(true)}
                />
              </div>
            </div>
            <div className="flex items-center w-full sm:justify-end">
              <div className="hidden pl-2 space-x-1 md:flex"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col my-6 mx-4 rounded-2xl shadow-xl shadow-gray-200">
        <div className="bg-white rounded-t-2xl flex justify-between">
          <div className="py-5 px-4">
            <div className="text-sm text-gray-400">
              <label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="p-1"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={35}>50</option>
                </select>{" "}
                registros por pagina
              </label>
            </div>
          </div>

          <div className="py-5 px-4 flex flex-col md:flex-row text-sm text-gray-400">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="p-1"
            >
              <option value="ASC">Antiguos primero</option>
              <option value="DESC">Ultimos primero</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-1"
            >
              <option value="inStock">En stock</option>
              <option value="empty">Sin stock</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-b-2xl">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <BatchTable
                rawMaterialBatches={rawMaterialBatches?.rows}
                loading={loading}
                onChange={(deleted) => setRefresh(deleted)}
                refresh={refresh}
              />
            </div>
          </div>
        </div>
        <Pagination
          loading={loading}
          page={page}
          limit={limit}
          totalPages={totalPages}
          onPageChange={(page) => setPage(page)}
        />
      </section>
    </>
  );
}
