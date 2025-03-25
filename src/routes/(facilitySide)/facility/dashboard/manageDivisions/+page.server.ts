import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import { 
        FacilityDAO, 
        facilityDivisionsPageSize, 
        DivisionDAO, 
        validatePhone, 
        validateOperatingHours, 
        ServicesDAO, 
        type OPServiceType, 
        type ServiceDTO, 
        specializedServiceType, 
        OPServiceTypes, 
        validateFloat,
        validateCoverageRadius,
        type CreateAmbulanceServiceDTO,
        AmbulanceServiceDAO,
        validateCompletionTime,
        type CreateBloodBankServiceDTO,
        BloodBankServiceDAO,
        type CreateERServiceDTO,
        ERServiceDAO,
        type CreateICUServiceDTO,
        ICUServiceDAO,
        type CreateOutpatientServiceDTO,
        OutpatientServiceDAO,
        validateFacilityName
      } from '$lib';
import type { Create_UpdateDivisionDTO } from '$lib/server/DTOs';

const divisionDAO = new DivisionDAO();
const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions ) {
    throw redirect(303, '/facility');
  }
  
  if (!Boolean(hasDivisions)) {
    throw redirect(303, '/facility/dashboard')
  }
  
  const paginatedDivisions = await divisionDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize)

  const linkableServices = await divisionDAO.getMultiServiceDivisions(facilityID);

  const servicesDAO = new ServicesDAO();

  const services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);
  let serviceTypes: OPServiceType[] = services.map(s => s.type);

  let availableServices: String[] = getAvailableSpecializedServices(serviceTypes)
  let availableOPServices: String[] = getAvailableOPServices(serviceTypes)

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
  }

  return {
    divisions: paginatedDivisions.divisions,
    totalPages: paginatedDivisions.totalPages,
    currentPage: 1,
    linkableServices,
    availableServices,
    availableOPServices,
  };
};

export const actions = {
  deleteDivision: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const divisionID = data.get("divisionID") as string;
    const password = data.get("password") as string;

    if (!divisionID || !password) {
      return fail(422, { 
        error: "Division ID and password are required",
        description: "missing params",
        success: false  
      });
    }

    try {
      // // Fetch facility data from DB
      // const facility = await facilityDAO.getByID(facilityID);
      // if (!facility) {
      //   console.error(`Facility with ID ${facilityID} not found.`);
      //   return fail(404, { 
      //     error: "Facility not found",
      //     description: "not_found",
      //     success: false  
      //   });
      // }

      // // Verify password
      // const passwordMatch = await bcrypt.compare(password, facility.password);
      // if (!passwordMatch) {
      //   return fail(400, { 
      //     error: 'Incorrect ID-password pair',
      //     description: 'pass',
      //     success: false
      //   });
      // }

      // divisionDAO.delete(divisionID)

    } catch (error) {
      return fail(500, { 
        error: "Failed to delete division",
        description: "database",
        success: false  
      });
    }

    return {
      success: true
    }
  },
  
  addDivision: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');

    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    let name: string
    let phoneNumber: string
    let openingTime: Date
    let closingTime: Date


    const divisionName = data.get('name');
    const phone = data.get('phoneNumber');
    const open = data.get('opening');
    const close = data.get('closing');

    try {
      name = validateFacilityName(divisionName);
      phoneNumber = validatePhone(phone);

      let OCTime = validateOperatingHours(open, close)
      openingTime = OCTime.openingTime
      closingTime = OCTime.closingTime

    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "Division Validation",
        success: false
      });
    }

    console.log(divisionName)
    console.log(phone)
    console.log(open)
    console.log(close)

    let newServices = []
    let serviceTypeNames: string[] = ["serviceType0", "serviceType1", "serviceType2"];

    const serviceType = data.get("serviceType") as string;
    const serviceType0 = data.get("serviceType0") as string;
    const serviceType1 = data.get("serviceType1") as string;
    const serviceType2 = data.get("serviceType2") as string;
    console.log("serviceType", serviceType)
    console.log("serviceType0", serviceType0)
    console.log("serviceType1", serviceType1)
    console.log("serviceType2", serviceType2)

    try {
      // for (let i = 0; i < 3; i++) {
      //   let t = "serviceType" + String(i)
      //   console.log(data.get("serviceType" + i))
      //   console.log("serviceType" + i)
      //   if (data.get("serviceType" + String(i))){

      //     service = addService({data, i})

      //     newServices.push(service)
      //   }
      // }

      for (var sType of serviceTypeNames) {
        console.log(sType, data.get(sType))
      }
    } catch (error) {
      return fail(422, {
          error: (error as Error).message,
          description: "Service Validation",
          success: false
        });
    }

    if (newServices.length == 0) {
      return fail(422, {
          error: "Division must have at least 1 service",
          description: "Service Validation",
          success: false
        });
    }

    const division: Create_UpdateDivisionDTO = {
      name,
      phoneNumber,
      openingTime,
      closingTime,
    }

    try {
      divisionDAO.create(facilityID, division)

      for (var service of newServices) {
        service.dao.create(facilityID, employeeID, service.service)
        console.log(service.service)
      }
    } catch (error) {
      return fail(422, {
          error: (error as Error).message,
          description: "Creation errors",
          success: false
        });
    }

    return {
      success: true
    }
  },

  editDivision: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const divisionID = data.get("divisionID") as string;

    // const adminInfo = await adminDAO.getInformation(adminID);

    const firstName = data.get('fname');
    const middleName = data.get('mname');
    const lastName = data.get('lname');
    const pass = data.get('password');

    let fname: string  
    let mname: string | undefined
    let lname: string   
    let password: string   

  },
} satisfies Actions;


function getAvailableSpecializedServices(serviceTypes: OPServiceType[]): String[] {
  let availableServices: String[] = ["None"]
  
  for (let serviceType of specializedServiceType) { 
    if (!serviceTypes.includes(serviceType)) {
      availableServices.push(serviceType);
    }
  }
  return availableServices
}

function getAvailableOPServices(serviceTypes: OPServiceType[]): String[] {
  let availableOPServices: String[] = ["None"]
  
  for (let serviceType of OPServiceTypes) { 
    if (!serviceTypes.includes(serviceType)) {
      availableOPServices.push(serviceType)
    }
  }
  return availableOPServices;
}

async function addService({ data, i }: {data: FormData, i: number}) {
  const serviceType = data.get('serviceType'+String(i));
  console.log(serviceType)

  const phone    = data.get('phoneNumber'+String(i));
  const open     = data.get('opening'+String(i));
  const close    = data.get('closing'+String(i));
  const rates    = data.get('price'+String(i));
  const minCover = data.get('minCoverageRadius'+String(i));
  const mileRate = data.get('mileageRate'+String(i));
  const maxCover = data.get('maxCoverageRadius'+String(i));

  const turnTD  = data.get('turnaroundDays'+String(i));
  const turnTH  = data.get('turnaroundHours'+String(i));

  const OPType  = data.get('OPserviceType'+String(i));
  const compTD  = data.get('completionDays'+String(i));
  const compTH  = data.get('completionHours'+String(i));
  const walkins = data.get('acceptWalkins'+String(i));
  
  switch (serviceType){
    case "Ambulance": {
      let phoneNumber: string
      let openingTime: Date
      let closingTime: Date
      let baseRate: number
      let minCoverageRadius: number
      let mileageRate: number
      let maxCoverageRadius: number

      try {
        phoneNumber = validatePhone(phone);
        baseRate = validateFloat(rates, "Base Rate");
        mileageRate = validateFloat(mileRate, "Mileage Rate");

        let OCTime = validateOperatingHours(open, close)
        openingTime = OCTime.openingTime
        closingTime = OCTime.closingTime

        let radius = validateCoverageRadius(minCover, maxCover)
        minCoverageRadius = radius.minCoverageRadius
        maxCoverageRadius = radius.maxCoverageRadius

      } catch (error) {
        throw new Error((error as Error).message);
      }

      const service: CreateAmbulanceServiceDTO = {
        phoneNumber,
        openingTime,
        closingTime,
        baseRate,
        minCoverageRadius,
        mileageRate,
        maxCoverageRadius
      }

      const dao = new AmbulanceServiceDAO();
      return {dao, service}
    }

    case "Blood Bank": {
      let phoneNumber: string
      let openingTime: Date
      let closingTime: Date
      let pricePerUnit: number
      let turnaroundTimeD: number
      let turnaroundTimeH: number

      try {
        phoneNumber = validatePhone(phone);
        pricePerUnit = validateFloat(rates, "Price Per Unit");

        let OCTime = validateOperatingHours(open, close)
        openingTime = OCTime.openingTime
        closingTime = OCTime.closingTime

        let TTime = validateCompletionTime(turnTD, turnTH, "Turnarond")
        turnaroundTimeD = TTime.days
        turnaroundTimeH = TTime.hours
      } catch (error) {
        throw new Error((error as Error).message);
      }

      const service: CreateBloodBankServiceDTO = {
        phoneNumber,
        openingTime,
        closingTime,
        pricePerUnit,
        turnaroundTimeD,
        turnaroundTimeH
      }

      const dao = new BloodBankServiceDAO();
      return {dao, service}
    }

    case "Emergency Room": {
      let phoneNumber: string

      try {
        phoneNumber = validatePhone(phone);
      } catch (error) {
        throw new Error((error as Error).message);
      }

      const service: CreateERServiceDTO = {
        phoneNumber
      }

      const dao = new ERServiceDAO();
      return {dao, service}
    }

    case "Intensive Care Unit": {
      let phoneNumber: string
      let baseRate: number

      try {
        phoneNumber = validatePhone(phone);
        baseRate = validateFloat(rates, "Base Rate");
      } catch (error) {
        throw new Error((error as Error).message);
      }

      const service: CreateICUServiceDTO = {
        phoneNumber,
        baseRate
      }

      const dao = new ICUServiceDAO();
      return {dao, service}
    }

    default: {
      let price: number
      let completionTimeD: number
      let completionTimeH: number

      const OPserviceType     = OPType as string;
      const acceptsWalkIns    = walkins === 'on';

      try {
        price = validateFloat(rates, "Price");
      
        let CTime = validateCompletionTime(compTD, compTH, "Completion")
        completionTimeD = CTime.days
        completionTimeH = CTime.hours
      } catch (error) {
        throw new Error((error as Error).message);
      }

      const service: CreateOutpatientServiceDTO = {
        serviceType: OPserviceType,
        price,
        completionTimeD,
        completionTimeH,
        acceptsWalkIns
      }

      const dao = new OutpatientServiceDAO();
      return {dao, service}
    }
  }
}
