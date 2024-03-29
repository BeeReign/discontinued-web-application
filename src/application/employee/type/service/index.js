import endPoints from "@utils/endpoints";
import { postData, getData, patchData, deleteData } from "@libs/axios";

export async function getTypesOfEmployee(limit, offset, filter) {
  const response = await getData(
    endPoints.typeOfEmployees.getTypesOfEmployee(limit, offset, filter)
  );
  return response.data;
}

export async function getAllModules() {
  const response = await getData(endPoints.modules.getAllModules);
  return response.data;
}

export async function getAllModulesByTypeId(id) {
  const response = await getData(endPoints.typeOfEmployees.getAllModules(id));
  return response.data;
}

export async function getAllTypesOfEmployee(query) {
  const response = await getData(
    endPoints.typeOfEmployees.getAllTypesOfEmployee(query)
  );
  return response.data;
}

export async function getTypeOfEmployee(id) {
  const response = await getData(
    endPoints.typeOfEmployees.getTypeOfEmployee(id)
  );
  return response.data;
}

export async function addTypeOfEmployee(body) {
  const response = await postData(
    endPoints.typeOfEmployees.addTypeOfEmployee,
    body
  );
  return response.data;
}

export async function updateTypeOfEmployee(id, body) {
  const response = await patchData(
    endPoints.typeOfEmployees.updateTypeOfEmployee(id),
    body
  );
  return response.data;
}

export async function deleteTypeOfEmployee(id) {
  await deleteData(endPoints.typeOfEmployees.deleteTypeOfEmployee(id));
}
