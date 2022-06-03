import Link from "next/link";
import { ViewGridIcon } from "@heroicons/react/outline";
import AddApiary from "@components/Apiary/Form/AddApiary";
import CheckPermission from "@utils/checkPermission";

export default function Add() {
  CheckPermission("/apiary");
  return (
    <>
      <section className="mx-3 xl:mx-6 flex items-center justify-between">
        <div className="flex justify-start items-center">
          <Link href="/apiary">
            <a>
              <ViewGridIcon className="w-9 text-beereign_grey" />
            </a>
          </Link>
          <div className="ml-2 font-sans font-normal text-3xl">
            Registro de Apiario
          </div>
        </div>
      </section>

      <section className="mx-3 xl:mx-6 text-center">
        <h2 className="mt-6 font-mono text-2xl">Información del Apiario</h2>
        <AddApiary />
      </section>
    </>
  );
}
