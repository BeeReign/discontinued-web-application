import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";

import { updateSchema } from "@schema/apiarySchema";
import { updateApiary } from "@service/api/apiary";
import { getAllCountries, getAllProvincesById } from "@service/api/country";
import Button from "@components/Button";
import { logError } from "@utils/logError";
import capitalize from "@utils/capitalize";

export default function EditApiary({ apiary }) {
  const formRef = useRef(null);
  const [country, setCountry] = useState(null);
  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  let query = "";

  const getCountries = () => {
    return getAllCountries(query)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        logError(err);
      });
  };

  const getProvinces = () => {
    return getAllProvincesById(country, query)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        logError(err);
      });
  };

  const onInputChange = (value) => {
    query = value;
  };

  const handleChangeCountry = (value) => {
    setCountry(value.id);
    query = "";
  };

  const handleChangeProvince = (value) => {
    setProvince(value.id);
    query = "";
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get("name").toLocaleLowerCase(),
      countryId: country ? country : apiary?.country.id,
      provinceId: province ? province : apiary?.province.id,
      city: formData.get("city").toLocaleLowerCase(),
    };
    const { error } = await updateSchema.validate(data);

    if (error) {
      toast.error("Los campos con ( * ) son necesarios");
      setLoading(false);
      return null;
    }
    updateApiary(apiary?.id, data)
      .then((response) => {
        formRef.current.reset();
        toast.success("Apiario Actualizado");
      })
      .catch((err) => {
        logError(err);
      })
      .finally(() => {
        setLoading(false);
        router.push("/apiary");
      });
  };

  return (
    <form className="mt-5" ref={formRef} onSubmit={handleSubmit}>
      <div className="mb-5 mx-auto w-full md:w-4/5 xl:w-9/12 2xl:w-3/5">
        <input
          name="name"
          type="text"
          defaultValue={apiary?.name}
          className="form-control block w-full px-3 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          placeholder="Nombre *"
          maxLength={50}
        />
      </div>

      <div className="mb-5 mx-auto w-full md:w-4/5 xl:w-9/12 2xl:w-3/5">
        <AsyncSelect
          className="form-control block w-full py-1 text-left font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none"
          styles={customStyles}
          getOptionLabel={(e) => capitalize(e.name)}
          getOptionValue={(e) => e.id}
          loadOptions={getCountries}
          onInputChange={onInputChange}
          defaultOptions
          placeholder={apiary?.country.name}
          onChange={handleChangeCountry}
        />
      </div>

      <div className="mb-5 mx-auto w-full md:w-4/5 xl:w-9/12 2xl:w-3/5">
        {country ? (
          <AsyncSelect
            className="form-control block w-full py-1 text-left font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none"
            styles={customStyles}
            cacheOptions
            getOptionLabel={(e) => capitalize(e.name)}
            getOptionValue={(e) => e.id}
            loadOptions={getProvinces}
            onInputChange={onInputChange}
            defaultOptions
            placeholder={apiary?.province.name}
            onChange={handleChangeProvince}
          />
        ) : (
          <AsyncSelect
            className="form-control block w-full py-1 text-left font-normal text-gray-700 bg-gray-100 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none"
            styles={customStyles}
            cacheOptions
            isDisabled={true}
            placeholder={apiary?.province.name}
          />
        )}
      </div>

      <div className="mb-5 mx-auto w-full md:w-4/5 xl:w-9/12 2xl:w-3/5">
        <input
          name="city"
          type="text"
          defaultValue={apiary?.city}
          className="form-control block w-full px-3 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          placeholder="Ciudad  *"
          maxLength={50}
        />
      </div>

      <Button loading={loading} />
    </form>
  );
}
