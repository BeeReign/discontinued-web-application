import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useEffect } from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import CheckPermission from "@utils/checkPermission";
import { getWarehouses } from "application/warehouse/service";
import { logError } from "@utils/logError";
import useDebounce from "@utils/useDebounce";

const WarehouseTable = dynamic(() =>
  import("application/warehouse/components/table")
);
const Pagination = dynamic(() =>
  import("application/common/pagination/normal")
);
const AddWarehouseModal = dynamic(() =>
  import("application/warehouse/components/addModal")
);

export default function Index() {
  CheckPermission("/warehouse");
  const [warehouses, setWarehouses] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const searchFilter = useDebounce(filter, 500);

  useEffect(() => {
    const loadWarehouses = async () => {
      setLoading(true);
      getWarehouses(limit, page, searchFilter)
        .then((result) => {
          setWarehouses(result);
        })
        .catch((error) => {
          logError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    loadWarehouses();
  }, [page, searchFilter, refresh, limit]);

  const searchItems = (value = "") => {
    setFilter(value.trim());
  };

  const totalPages = Math.ceil(warehouses?.count / limit);
  return (
    <>
      <Head>
        <title>Bodegas</title>
      </Head>
      <AddWarehouseModal
        showModal={showAddModal}
        onAdd={(refresh) => setRefresh(refresh)}
        refresh={refresh}
        onShowModalChange={(showModal) => setShowAddModal(showModal)}
      />
      <section className="block justify-between items-center p-4 mx-4 mb-6 bg-white rounded-2xl shadow-xl shadow-gray-200 lg:p-5 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <nav className="flex mb-5">
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
                  </div>
                </li>
                <div className="ml-1 font-medium text-gray-400 md:ml-2 cursor-default">
                  Bodegas
                </div>
              </ol>
            </nav>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Todas las bodegas
            </h1>
          </div>
          <div className="block items-center sm:flex md:divide-x md:divide-gray-100">
            <div className="mb-4 sm:pr-3 sm:mb-0">
              <div className="relative mt-1 sm:w-64 xl:w-96">
                <input
                  type="search"
                  autoFocus
                  className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-yellow-50 focus:border-beereign_yellow block w-full p-2.5 focus:outline-none"
                  placeholder="Buscar bodegas"
                  onChange={(e) =>
                    searchItems(e.target.value.toLocaleLowerCase())
                  }
                />
              </div>
            </div>
            <div className="flex items-center w-full sm:justify-end">
              <div className="hidden pl-2 space-x-1 md:flex"></div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-gradient-to-br from-green-800 to-green-600 sm:ml-auto shadow-md shadow-gray-300 hover:scale-105 cursor-default transition-transform"
              >
                <PlusIcon className="w-6 mr-2 -ml-1" />
                Agregar bodega
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col my-6 mx-4 rounded-2xl shadow-xl shadow-gray-200 bg-white overflow-hidden">
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

        <div className="overflow-x-auto rounded-b-2xl">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <WarehouseTable
                warehouses={warehouses?.rows}
                loading={loading}
                onChange={(refresh) => setRefresh(refresh)}
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
