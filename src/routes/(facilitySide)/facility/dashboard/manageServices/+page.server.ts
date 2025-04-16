import { fail, redirect } from '@sveltejs/kit';
import { Role, type Availability, type Load } from '@prisma/client';

import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

import type { AmbulanceServiceDTO, 
              BloodBankServiceDTO, 
              BloodTypeMappingDTO, 
              ERServiceDTO, 
              ICUServiceDTO, 
              ServiceDTO,
              OPServiceType,
            } from '$lib';

import { facilityServicePageSize,

         OPServiceTypes, 
         specializedServiceType,

         AmbulanceServiceDAO,
         BloodBankServiceDAO,
         ERServiceDAO,
         ICUServiceDAO,
         OutpatientServiceDAO,
         ServicesDAO,

         dateToTimeMapping,
         EmployeeDAO,
         DivisionDAO,
         FacilityServiceListDAO,
         AdminDAO,

         validateAmbulance,
         validateBloodBank,
         validateER,
         validateICU,
         validateOP,

         validateInteger,
       } from '$lib';
import type { FacilityDivisionResultsDTO, OutpatientServiceDTO } from '$lib/server/DTOs';

// DAOs
const servicesDAO = new ServicesDAO();
const employeeDAO = new EmployeeDAO();

const ambulanceDAO = new AmbulanceServiceDAO();
const bloodBankDAO = new BloodBankServiceDAO();
const eRDAO = new ERServiceDAO();
const iCUDAO = new ICUServiceDAO();
const outpatientDAO = new OutpatientServiceDAO();

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const role = cookies.get('role');
  const employeeID = cookies.get('employeeID');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions || !employeeID) {
    throw redirect(303, '/facility');
  }
  
  const servicesDAO = new ServicesDAO();
  const divisionDAO = new DivisionDAO();

  const facilityService = new FacilityServiceListDAO()

  let paginatedServices = await facilityService.getPaginatedServicesByFacility(facilityID, employeeID, role as Role, 1, facilityServicePageSize, { updatedAt: "desc" })

  // const divisions: DivisionDTO[] = await divisionDAO.getByFacility(facilityID);

  const services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);
  let serviceTypes: OPServiceType[] = services.map(s => s.type);

  let availableServices: String[] = getAvailableSpecializedServices(serviceTypes)
  let availableOPServices: String[] = getAvailableOPServices(serviceTypes)

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
  }

  let divisions: FacilityDivisionResultsDTO[] = []

  if (hasDivisions === 'true' ? true : false) {
    if (role == Role.MANAGER){
      divisions = await divisionDAO.getByFacility(facilityID);
    } else {
      const adminDAO = new AdminDAO()
      divisions = await adminDAO.getDivisions(employeeID)
    }
  } 

  return {
    // Paginated Services
    services: paginatedServices.results,
    totalPages: paginatedServices.totalPages,
    currentPage: paginatedServices.currentPage,

    // Add Service Lists
    availableServices,
    availableOPServices,

    hasAdmins: hasAdmins === 'true' ? true : false,
    hasDivisions: hasDivisions === 'true' ? true : false,
    divisions,
    role,
  };
};

export const actions: Actions = {
  deleteService: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const formData = await request.formData();

    const serviceID = formData.get("serviceID") as string;
    const serviceType = formData.get("serviceType") as string;
    const password = formData.get("password") as string; // Get password from confirmation

    if (!serviceID || !serviceType || !password) {
      return fail(422, { 
        error: "Service ID, type, and password are required",
        description: "missing_params",
        success: false  
      });
    }

    try {
      const employee = await employeeDAO.getByID(employeeID);

      if (!employee) {
        console.error(`Facility with ID ${employeeID} not found.`);
        return fail(404, { 
          error: "Facility not found",
          description: "not_found",
          success: false  
        });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (!passwordMatch) {
        return fail(400, { 
          error: 'Incorrect ID-password pair',
          description: 'pass',
          success: false
        });
      }

      await servicesDAO.delete(serviceID, facilityID, employeeID);

      return {
        success: true
      }
      
    } catch (error) {
      return fail(500, { 
        error: "Failed to delete service",
        description: "database",
        success: false  
      });
    }
  },
  
  addService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    const hasDivisions = cookies.get('hasDivisions');

    if (!facilityID || !employeeID || !hasDivisions) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();
    const serviceType = data.get('serviceType') as string;

    let dao : AmbulanceServiceDAO
            | BloodBankServiceDAO
            | ERServiceDAO
            | ICUServiceDAO
            | OutpatientServiceDAO

    let service: any
      // CreateAmbulanceServiceDTO
      // CreateBloodBankServiceDTO
      // CreateERServiceDTO
      // CreateICUServiceDTO
      // CreateOutpatientServiceDTO

    try {
      switch (serviceType) {
        case "Ambulance": {
          // let service: CreateAmbulanceServiceDTO
          service = validateAmbulance(data, undefined)
          dao = ambulanceDAO;
          break;
        }

        case "Blood Bank": {
          // let service: CreateBloodBankServiceDTO
          service = validateBloodBank(data, undefined)
          dao = bloodBankDAO;
          break;
        }

        case "Emergency Room": {
          // let service: CreateERServiceDTO
          service = validateER(data, undefined)
          dao = eRDAO;
          break;
        }

        case "Intensive Care Unit": {
          // let service: CreateICUServiceDTO
          service = validateICU(data, undefined)
          dao = iCUDAO;
          break;
        }
        case "Outpatient": {
          // let service: CreateOutpatientServiceDTO
          service = validateOP(data, undefined) 
          dao = outpatientDAO;
          break;
        }
        default: {
          return fail(422, { 
            error: "No service type selected", 
            description: "serviceType",
            success: false
          });
        }
      }
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    if (hasDivisions === 'true' ? true : false) {
      const divisionID = data.get("divisionID") as string;
      if (divisionID) {
        service.divisionID = divisionID
      } else {
        return fail(422, {
          error: "No division selected",
          success: false
        });
      }
    }

    try {
      await dao.create(facilityID, employeeID, service)
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    return {
      success: true
    }
  },

  editService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    const hasDivisions = cookies.get('hasDivisions');

    if (!facilityID || !employeeID || !hasDivisions) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const serviceType = data.get('serviceType');
    let serviceID = data.get('serviceID') as string;

    let dao : AmbulanceServiceDAO
            | BloodBankServiceDAO
            | ERServiceDAO
            | ICUServiceDAO
            | OutpatientServiceDAO

    let service: any
      // AmbulanceServiceDTO
      // BloodBankServiceDTO
      // ERServiceDTO
      // ICUServiceDTO
      // OutpatientServiceDTO

    switch (serviceType) {
      case "Ambulance": {
        let ambulanceInfo: AmbulanceServiceDTO
        // let service: AmbulanceServiceDTO

        try {
          ambulanceInfo = await ambulanceDAO.getInformation(serviceID);
        } catch (error) {
          return fail(422, { 
            error: "Service not found",
            description: "serviceID",
            success: false  
          });
        }
        
        try {
          const availability: Availability = data.get('availability') as Availability

          service = {...validateAmbulance(data, undefined), availability}
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        if (hasDivisions === 'true' ? true : false){
          let divisionName: string = data.get('divisionName') as string
          let divisionID: string = data.get('divisionID') as string

          if (!divisionID) {
            return fail(422, {
              error: "No division selected",
              success: false
            });
          } else {
            service.division = { divisionID : divisionID, name: divisionName }
          }
        }
        if (ambulanceInfo.phoneNumber                     == service.phoneNumber &&
            dateToTimeMapping(ambulanceInfo.openingTime)  == dateToTimeMapping(service.openingTime) &&
            dateToTimeMapping(ambulanceInfo.closingTime)  == dateToTimeMapping(service.closingTime) &&
            ambulanceInfo.baseRate                        == service.baseRate &&
            ambulanceInfo.minCoverageRadius               == service.minCoverageRadius &&
            ambulanceInfo.mileageRate                     == service.mileageRate &&
            ambulanceInfo.maxCoverageRadius               == service.maxCoverageRadius &&
            ambulanceInfo.availability                    == service.availability &&
            ambulanceInfo.division?.name                  == service.division?.divisionID && 
            ambulanceInfo.division?.divisionID            == service.division?.name
          ) {
          return fail(422, { 
            error: "No changes made",
            description: "button",
            success: false  
          });
        }
        dao = ambulanceDAO;
        break;
      }

      case "Blood Bank": {
        let bloodBankInfo: BloodBankServiceDTO
        // let service: BloodBankServiceDTO

        try {
          bloodBankInfo = await bloodBankDAO.getInformation(serviceID);
        } catch (error) {
          return fail(422, { 
            error: "Service not found",
            description: "serviceID",
            success: false  
          });
        }

        try {
          let bloodTypeAvailability: BloodTypeMappingDTO = {
            A_P  : (data.get('ap') ?? '') === 'on',
            A_N  : (data.get('an') ?? '') === 'on',
            B_P  : (data.get('bp') ?? '') === 'on',
            B_N  : (data.get('bn') ?? '') === 'on',
            O_P  : (data.get('op') ?? '') === 'on',
            O_N  : (data.get('on') ?? '') === 'on',
            AB_P : (data.get('abp') ?? '') === 'on',
            AB_N : (data.get('abn') ?? '') === 'on',
          }

          service = {...validateBloodBank(data, undefined), bloodTypeAvailability}
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        if (hasDivisions === 'true' ? true : false){
          let divisionName: string = data.get('divisionName') as string
          let divisionID: string = data.get('divisionID') as string

          if (!divisionID) {
            return fail(422, {
              error: "No division selected",
              success: false
            });
          } else {
            service.division = { divisionID : divisionID, name: divisionName }
          }
        }

        if (bloodBankInfo.phoneNumber                     == service.phoneNumber &&
            dateToTimeMapping(bloodBankInfo.openingTime)  == dateToTimeMapping(service.openingTime) &&
            dateToTimeMapping(bloodBankInfo.closingTime)  == dateToTimeMapping(service.closingTime) &&
            bloodBankInfo.basePricePerUnit                == service.basePricePerUnit &&
            bloodBankInfo.turnaroundTimeD                 == service.turnaroundTimeD &&
            bloodBankInfo.turnaroundTimeH                 == service.turnaroundTimeH &&
            bloodBankInfo.bloodTypeAvailability.A_P       == service.bloodTypeAvailability.A_P &&
            bloodBankInfo.bloodTypeAvailability.A_N       == service.bloodTypeAvailability.A_N &&
            bloodBankInfo.bloodTypeAvailability.B_P       == service.bloodTypeAvailability.B_P &&
            bloodBankInfo.bloodTypeAvailability.B_N       == service.bloodTypeAvailability.B_N &&
            bloodBankInfo.bloodTypeAvailability.O_P       == service.bloodTypeAvailability.O_P &&
            bloodBankInfo.bloodTypeAvailability.O_N       == service.bloodTypeAvailability.O_N &&
            bloodBankInfo.bloodTypeAvailability.AB_P      == service.bloodTypeAvailability.AB_P &&
            bloodBankInfo.bloodTypeAvailability.AB_N      == service.bloodTypeAvailability.AB_N &&
            bloodBankInfo.division?.name                  == service.division?.divisionID && 
            bloodBankInfo.division?.divisionID            == service.division?.name
          ) {
          return fail(422, { 
              error: "No changes made",
              description: "button",
              success: false  
            });
        }
        dao = bloodBankDAO;
        break;
      }

      case "Emergency Room": {
        let erInfo: ERServiceDTO
        // let service: ERServiceDTO

        try {
          erInfo = await eRDAO.getInformation(serviceID);
        } catch (error) {
          return fail(422, { 
            error: "Service not found",
            description: "serviceID",
            success: false  
          });
        }

        try {
          const load: Load = data.get('load') as Load
          const availableBeds = validateInteger(data.get('availableBeds'), "Available Beds");

          const nonUrgentPatients = validateInteger(data.get('nonUrgentPatients'), "Non Urgent Patients");
          const nonUrgentQueueLength = validateInteger(data.get('nonUrgentQueueLength'), "Non Urgent Queue Length");

          const urgentPatients = validateInteger(data.get('urgentPatients'), "Urgent Patients");
          const urgentQueueLength = validateInteger(data.get('urgentQueueLength'), "Urgent Queue Length");

          const criticalPatients = validateInteger(data.get('criticalPatients'), "Critical Patients");
          const criticalQueueLength = validateInteger(data.get('criticalQueueLength'), "Critical Queue Length");

          service = {
            ...validateER(data, undefined), 
            availableBeds, 
            load, 
            nonUrgentPatients, 
            nonUrgentQueueLength, 
            urgentPatients, 
            urgentQueueLength, 
            criticalPatients, 
            criticalQueueLength
          }
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        if (hasDivisions === 'true' ? true : false){
          let divisionName: string = data.get('divisionName') as string
          let divisionID: string = data.get('divisionID') as string

          if (!divisionID) {
            return fail(422, {
              error: "No division selected",
              success: false
            });
          } else {
            service.division = { divisionID : divisionID, name: divisionName }
          }
        }
        if (erInfo.phoneNumber          == service.phoneNumber &&
            erInfo.load                 == service.load &&
            erInfo.availableBeds        == service.availableBeds &&
            erInfo.nonUrgentPatients    == service.nonUrgentPatients &&
            erInfo.nonUrgentQueueLength == service.nonUrgentQueueLength &&
            erInfo.urgentPatients       == service.urgentPatients &&
            erInfo.urgentQueueLength    == service.urgentQueueLength &&
            erInfo.criticalPatients     == service.criticalPatients &&
            erInfo.criticalQueueLength  == service.criticalQueueLength &&
            erInfo.division?.name       == service.division?.divisionID && 
            erInfo.division?.divisionID == service.division?.name
          ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }
        dao = eRDAO;
        break;
      }

      case "Intensive Care Unit": {
        let icuInfo: ICUServiceDTO
        // let service: ICUServiceDTO

        try {
          icuInfo = await iCUDAO.getInformation(serviceID);
        } catch (error) {
          return fail(422, { 
            error: "Service not found",
            description: "serviceID",
            success: false  
          });
        }

        try {
          const load: Load = data.get('load') as Load
          const availableBeds       = validateInteger(data.get('availableBeds'), "Available Beds");
          const cardiacSupport      = (data.get('cardiacSupport') ?? '') === 'on'
          const neurologicalSupport = (data.get('neurologicalSupport') ?? '') === 'on'
          const renalSupport        = (data.get('renalSupport') ?? '') === 'on'
          const respiratorySupport  = (data.get('respiratorySupport') ?? '') === 'on'

          service = {
            ...validateICU(data, undefined), 
            load,
            availableBeds, 
            cardiacSupport, 
            neurologicalSupport, 
            renalSupport, 
            respiratorySupport
          }
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        if (hasDivisions === 'true' ? true : false){
          let divisionName: string = data.get('divisionName') as string
          let divisionID: string = data.get('divisionID') as string

          if (!divisionID) {
            return fail(422, {
              error: "No division selected",
              success: false
            });
          } else {
            service.division = { divisionID : divisionID, name: divisionName }
          }
        }

        if (icuInfo.phoneNumber          == service.phoneNumber &&
            icuInfo.baseRate             == service.baseRate &&
            icuInfo.load                 == service.load &&
            icuInfo.availableBeds        == service.availableBeds &&
            icuInfo.cardiacSupport       == service.cardiacSupport &&
            icuInfo.neurologicalSupport  == service.neurologicalSupport &&
            icuInfo.renalSupport         == service.renalSupport &&
            icuInfo.respiratorySupport   == service.respiratorySupport &&
            icuInfo.division?.name       == service.division?.divisionID && 
            icuInfo.division?.divisionID == service.division?.name
          ) {
          return fail(422, { 
            error: "No changes made",
            description: "button",
            success: false  
          });
        }
        dao = iCUDAO;
        break;
      }

      case "Outpatient": {
        let opInfo: OutpatientServiceDTO
        // let service: OutpatientServiceDTO

        try {
          opInfo = await outpatientDAO.getInformation(serviceID);
        } catch (error) {
          return fail(422, { 
            error: "Service not found",
            description: "serviceID",
            success: false  
          });
        }

        try {
          const isAvailable: boolean = (data.get('isAvailable') ?? '') === 'on'
          const acceptsWalkIns: boolean = (data.get('acceptsWalkIns') ?? '') === 'on'

          service = {
            ...validateOP(data, undefined), 
            isAvailable, 
            acceptsWalkIns,
          }
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        if (hasDivisions === 'true' ? true : false){
          let divisionName: string = data.get('divisionName') as string
          let divisionID: string = data.get('divisionID') as string

          if (!divisionID) {
            return fail(422, {
              error: "No division selected",
              success: false
            });
          } else {
            service.division = { divisionID : divisionID, name: divisionName }
          }
        }

        if (opInfo.basePrice            == service.basePrice &&
            opInfo.completionTimeD      == service.completionTimeD &&
            opInfo.completionTimeH      == service.completionTimeH &&
            opInfo.isAvailable          == service.isAvailable &&
            opInfo.acceptsWalkIns       == service.acceptsWalkIns &&
            opInfo.division?.name       == service.division?.divisionID && 
            opInfo.division?.divisionID == service.division?.name
          ) {
          return fail(422, { 
            error: "No changes made",
            description: "button",
            success: false  
          });
        }
        dao = outpatientDAO;
        break;
      }

      default: {
        return fail(422, { 
          error: "No service type selected", 
          description: "serviceType",
          success: false
        });
      }
    }

    try {
      await dao.update(serviceID, facilityID, employeeID, service)
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    return {
      success: true
    }
  },
};


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

