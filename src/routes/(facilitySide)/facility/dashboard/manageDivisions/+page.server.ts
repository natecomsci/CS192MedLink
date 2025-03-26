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
import type { Create_UpdateDivisionDTO, MultiServiceDivisionsDTO } from '$lib/server/DTOs';

const divisionDAO = new DivisionDAO();

let existingServices: MultiServiceDivisionsDTO[]

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions ) {
    throw redirect(303, '/facility');
  }
  
  if (hasDivisions === 'true' ? false : true) {
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

  existingServices = linkableServices

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
    // const facilityID = cookies.get('facilityID');

    // if (!facilityID) {
    //   throw redirect(303, '/facility');
    // }

    // const data = await request.formData();

    // const divisionID = data.get("divisionID") as string;
    // const password = data.get("password") as string;

    // if (!divisionID || !password) {
    //   return fail(422, { 
    //     error: "Division ID and password are required",
    //     description: "missing params",
    //     success: false  
    //   });
    // }

    // try {
    //   // // Fetch facility data from DB
    //   // const facility = await facilityDAO.getByID(facilityID);
    //   // if (!facility) {
    //   //   console.error(`Facility with ID ${facilityID} not found.`);
    //   //   return fail(404, { 
    //   //     error: "Facility not found",
    //   //     description: "not_found",
    //   //     success: false  
    //   //   });
    //   // }

    //   // // Verify password
    //   // const passwordMatch = await bcrypt.compare(password, facility.password);
    //   // if (!passwordMatch) {
    //   //   return fail(400, { 
    //   //     error: 'Incorrect ID-password pair',
    //   //     description: 'pass',
    //   //     success: false
    //   //   });
    //   // }

    //   // divisionDAO.delete(divisionID)

    // } catch (error) {
    //   return fail(500, { 
    //     error: "Failed to delete division",
    //     description: "database",
    //     success: false  
    //   });
    // }

    // return {
    //   success: true
    // }
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

      const facilityDivisions = await divisionDAO.getByFacility(facilityID)
      for (let div of facilityDivisions) {
        console.log(div.name, div.name === name)
        if (div.name === name) {
          return fail(422, {
            error: "Duplicate name detected",
            description: "Division Validation",
            success: false
          });
        }
      }



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

    const serviceType = data.get("serviceType");

    let newService

    if (serviceType) {
      try {
        newService = validateService({data})
      } catch (error) {
        return fail(422, {
            error: (error as Error).message,
            description: "Service Validation",
            success: false
          });
      }
    }

    let servicesToAttach = []
    let numberOfExistingServices
    let count = 0

    for (let {services} of existingServices) {
      numberOfExistingServices = services.length
      for (let {serviceID, type} of services) {
        if (data.get(serviceID)) {
          count++
          servicesToAttach.push(serviceID)
        }

        if (numberOfExistingServices == count) {
          return fail(422, {
            error: "Cannot select all services in an existing facility",
            description: "Creation errors",
            success: false
          });
        }
      }

      count = 0 
    }

    if (!serviceType && (servicesToAttach.length === 0)) {
      return fail(422, {
          error: "New division must have at least 1 serviwace",
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
      const divisionID = await divisionDAO.create(facilityID, division)
      if (newService) {
        const serviceID = await newService.dao.create(facilityID, employeeID, newService.service)
        servicesToAttach.push(serviceID)
      }

      divisionDAO.connectServicesToDivision(divisionID, servicesToAttach)
      
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
    // const facilityID = cookies.get('facilityID');

    // if (!facilityID) {
    //   throw redirect(303, '/facility');
    // }

    // const data = await request.formData();

    // const divisionID = data.get("divisionID") as string;

    // // const adminInfo = await adminDAO.getInformation(adminID);

    // const firstName = data.get('fname');
    // const middleName = data.get('mname');
    // const lastName = data.get('lname');
    // const pass = data.get('password');

    // let fname: string  
    // let mname: string | undefined
    // let lname: string   
    // let password: string   

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

function validateService({ data }: {data: FormData}) {
  const serviceType = data.get('serviceType');

  const phone    = data.get('phoneNumber');
  const open     = data.get('opening');
  const close    = data.get('closing');
  const rates    = data.get('price');
  const minCover = data.get('minCoverageRadius');
  const mileRate = data.get('mileageRate');
  const maxCover = data.get('maxCoverageRadius');

  const turnTD  = data.get('turnaroundDays');
  const turnTH  = data.get('turnaroundHours');

  const OPType  = data.get('OPserviceType');
  const compTD  = data.get('completionDays');
  const compTH  = data.get('completionHours');
  const walkins = data.get('acceptWalkins');
  
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
