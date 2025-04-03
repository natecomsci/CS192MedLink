import { fail, redirect } from '@sveltejs/kit';
import type { Availability, Load } from '@prisma/client';

import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

import type { AmbulanceServiceDTO, 
              BloodBankServiceDTO, 
              BloodTypeMappingDTO, 
              CreateAmbulanceServiceDTO, 
              CreateBloodBankServiceDTO, 
              CreateERServiceDTO, 
              CreateICUServiceDTO, 
              CreateOutpatientServiceDTO, 
              ERServiceDTO, 
              ICUServiceDTO, 
              OutpatientServiceDTO, 
              ServiceDTO,
              OPServiceType,
              DivisionDTO,
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

         validateCompletionTime, 
         validateCoverageRadius, 
         validateFloat, 
         validateInteger, 
         validateOperatingHours, 
         validatePhone,

         dateToTimeMapping,
         EmployeeDAO,
         DivisionDAO,
         FacilityServiceListDAO,
       } from '$lib';

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
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions ) {
    throw redirect(303, '/facility');
  }
  
  const servicesDAO = new ServicesDAO();
  const divisionDAO = new DivisionDAO();

  const facilityService = new FacilityServiceListDAO()

  let paginatedServices = await facilityService.getPaginatedServicesByFacility(facilityID, 1, facilityServicePageSize, { updatedAt: "desc" })

  const divisions: DivisionDTO[] = await divisionDAO.getByFacility(facilityID);

  const services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);
  let serviceTypes: OPServiceType[] = services.map(s => s.type);

  let availableServices: String[] = getAvailableSpecializedServices(serviceTypes)
  let availableOPServices: String[] = getAvailableOPServices(serviceTypes)

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
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

    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

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
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const divisionID = data.get("divisionID") as string;
        let service: CreateAmbulanceServiceDTO = {
            phoneNumber,
            openingTime,
            closingTime,
            baseRate,
            minCoverageRadius,
            mileageRate,
            maxCoverageRadius
          }

        if (divisionID) {
          service.divisionID = divisionID
        }

        const dao = new AmbulanceServiceDAO();

        dao.create(facilityID, employeeID, service)
        return {
          success: true
        }
      }

      case "Blood Bank": {
        let phoneNumber: string
        let openingTime: Date
        let closingTime: Date
        let basePricePerUnit: number
        let turnaroundTimeD: number
        let turnaroundTimeH: number

        try {
          phoneNumber = validatePhone(phone);
          basePricePerUnit = validateFloat(rates, "Price Per Unit");

          let OCTime = validateOperatingHours(open, close)
          openingTime = OCTime.openingTime
          closingTime = OCTime.closingTime

          let TTime = validateCompletionTime(turnTD, turnTH, "Turnarond")
          turnaroundTimeD = TTime.days
          turnaroundTimeH = TTime.hours
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const divisionID = data.get("divisionID") as string;
        let service: CreateBloodBankServiceDTO = {
            phoneNumber,
            openingTime,
            closingTime,
            basePricePerUnit,
            turnaroundTimeD,
            turnaroundTimeH
          }

        if (divisionID) {
          service.divisionID = divisionID
        }

        const dao = new BloodBankServiceDAO();

        dao.create(facilityID, employeeID, service)
        return {
          success: true
        }
      }

      case "Emergency Room": {
        let phoneNumber: string

        try {
          phoneNumber = validatePhone(phone);
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }
        
        const divisionID = data.get("divisionID") as string;
        const service: CreateERServiceDTO = {
          phoneNumber
        }

        if (divisionID) {
          service.divisionID = divisionID
        }

        const dao = new ERServiceDAO();

        dao.create(facilityID, employeeID, service)
        return {
          success: true
        }
      }

      case "Intensive Care Unit": {
        let phoneNumber: string
        let baseRate: number

        try {
          phoneNumber = validatePhone(phone);
          baseRate = validateFloat(rates, "Base Rate");
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const divisionID = data.get("divisionID") as string;
        let service: CreateICUServiceDTO = {
            phoneNumber,
            baseRate,
          }

        if (divisionID) {
          service.divisionID = divisionID
        }

        const dao = new ICUServiceDAO();

        dao.create(facilityID, employeeID, service)
        return {
          success: true
        }
      }

      case "Outpatient": {
        let basePrice: number
        let completionTimeD: number
        let completionTimeH: number

        const OPserviceType     = OPType as string;
        const acceptsWalkIns    = walkins === 'on';

        try {
          basePrice = validateFloat(rates, "Price");
        
          let CTime = validateCompletionTime(compTD, compTH, "Completion")
          completionTimeD = CTime.days
          completionTimeH = CTime.hours
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const divisionID = data.get("divisionID") as string;
        let service: CreateOutpatientServiceDTO = {
            type: OPserviceType,
            basePrice,
            completionTimeD,
            completionTimeH,
            acceptsWalkIns
          }

        if (divisionID) {
          service.divisionID = divisionID
        }

        const dao = new OutpatientServiceDAO();

        dao.create(facilityID, employeeID, service)

        return {
          success: true
        }
      }

      default: {
        return fail(422, { 
          error: "No service type selected", 
          description: "serviceType",
          success: false
        });
      }
    }
  },

  editAmbulanceService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();
    let serviceID = data.get('serviceID');

    if (!serviceID) {
      return fail(422, { 
        error: "Service not found",
        description: "serviceID",
        success: false  
      });
    }

    serviceID = String(serviceID)

    const serviceInfo = await ambulanceDAO.getInformation(serviceID);

    // Original Info
    const defPhoneNumber: String | undefined = serviceInfo.phoneNumber
    const defOpeningTime: String = dateToTimeMapping(serviceInfo.openingTime)
    const defClosingTime: String = dateToTimeMapping(serviceInfo.closingTime)
    const defBaseRate: Number = serviceInfo.baseRate
    const defMinCoverageRadius: Number = serviceInfo.minCoverageRadius
    const defMileageRate: Number = serviceInfo.mileageRate
    const defMaxCoverageRadius: Number = serviceInfo.maxCoverageRadius
    const defAvailability: Availability = serviceInfo.availability
    
    const defDivisionName: string | undefined = serviceInfo.division?.name
    const defDivisionID: string | undefined = serviceInfo.division?.divisionID

    // New Info
    let phoneNumber: string
    let openingTime: Date
    let closingTime: Date
    let baseRate: number
    let minCoverageRadius: number
    let mileageRate: number
    let maxCoverageRadius: number
    let availability: Availability = data.get('availability') as Availability

    let divisionName: string | undefined = data.get('divisionName') === null ? undefined : data.get('divisionName') as string
    let divisionID: string | undefined = data.get('divisionID') === null ? undefined : data.get('divisionID') as string

    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
      baseRate = validateFloat(data.get('price'), "Base Rate");

      let OCTime = validateOperatingHours(data.get('opening'), data.get('closing'))
      openingTime = OCTime.openingTime
      closingTime = OCTime.closingTime
    
      let radius = validateCoverageRadius(data.get('minCoverageRadius'), data.get('maxCoverageRadius'))
      minCoverageRadius = radius.minCoverageRadius
      maxCoverageRadius = radius.maxCoverageRadius

      mileageRate = validateFloat(data.get('mileageRate'), "Mileage Rate");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    const service: AmbulanceServiceDTO = {
      phoneNumber,
      openingTime,
      closingTime,
      baseRate,
      minCoverageRadius,
      mileageRate,
      maxCoverageRadius,
      availability
    }

    if (defPhoneNumber == phoneNumber &&
        defOpeningTime == dateToTimeMapping(openingTime) &&
        defClosingTime == dateToTimeMapping(closingTime) &&
        defBaseRate == baseRate &&
        defMinCoverageRadius == minCoverageRadius &&
        defMileageRate == mileageRate &&
        defMaxCoverageRadius == maxCoverageRadius &&
        defAvailability == availability &&
        defDivisionID == divisionID && 
        defDivisionName == divisionName
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }
    if (divisionID && divisionName) {
      service.division = {divisionID : divisionID, name: divisionName}
    }

    ambulanceDAO.update(serviceID, facilityID, employeeID, service)

    return {
      success: true
    }
  },

  editBloodBankService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();
    let serviceID = data.get('serviceID');

    if (!serviceID) {
      return fail(422, { 
        error: "Service not found",
        description: "serviceID",
        success: false  
      });
    }

    serviceID = String(serviceID)

    const serviceInfo = await bloodBankDAO.getInformation(serviceID);

    const defPhoneNumber     : String | undefined = serviceInfo.phoneNumber
    const defOpeningTime     : String = dateToTimeMapping(serviceInfo.openingTime)
    const defClosingTime     : String = dateToTimeMapping(serviceInfo.closingTime)
    const defPricePerUnit    : Number = serviceInfo.basePricePerUnit
    const defTurnaroundTimeD : Number = serviceInfo.turnaroundTimeD
    const defTurnaroundTimeH : Number = serviceInfo.turnaroundTimeH
    const defA_P  : boolean = serviceInfo.bloodTypeAvailability.A_P
    const defA_N  : boolean = serviceInfo.bloodTypeAvailability.A_N
    const defB_P  : boolean = serviceInfo.bloodTypeAvailability.B_P
    const defB_N  : boolean = serviceInfo.bloodTypeAvailability.B_N
    const defO_P  : boolean = serviceInfo.bloodTypeAvailability.O_P
    const defO_N  : boolean = serviceInfo.bloodTypeAvailability.O_N
    const defAB_P : boolean = serviceInfo.bloodTypeAvailability.AB_P
    const defAB_N : boolean = serviceInfo.bloodTypeAvailability.AB_N
    
    const defDivisionName: string | undefined = serviceInfo.division?.name
    const defDivisionID: string | undefined = serviceInfo.division?.divisionID

    let phoneNumber: string
    let openingTime: Date
    let closingTime: Date
    let basePricePerUnit: number
    let turnaroundTimeD: number
    let turnaroundTimeH: number
    
    let divisionName: string | undefined = data.get('divisionName') === null ? undefined : data.get('divisionName') as string
    let divisionID: string | undefined = data.get('divisionID') === null ? undefined : data.get('divisionID') as string

    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
      basePricePerUnit = validateFloat(data.get('price'), "Price Per Unit");

      let OCTime = validateOperatingHours(data.get('opening'), data.get('closing'))
      openingTime = OCTime.openingTime
      closingTime = OCTime.closingTime

      let TTime = validateCompletionTime(data.get('turnaroundDays'), data.get('turnaroundHours'), "Turnarond")
      turnaroundTimeD = TTime.days
      turnaroundTimeH = TTime.hours
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    const A_P  = (data.get('ap') ?? '') === 'on'
    const A_N  = (data.get('an') ?? '') === 'on'
    const B_P  = (data.get('bp') ?? '') === 'on'
    const B_N  = (data.get('bn') ?? '') === 'on'
    const O_P  = (data.get('op') ?? '') === 'on'
    const O_N  = (data.get('on') ?? '') === 'on'
    const AB_P = (data.get('abp') ?? '') === 'on'
    const AB_N = (data.get('abn') ?? '') === 'on'

    let bloodTypeAvailability: BloodTypeMappingDTO = {
      A_P ,
      A_N ,
      B_P ,
      B_N ,
      O_P ,
      O_N ,
      AB_P,
      AB_N,
    }

    const service: BloodBankServiceDTO = {
      phoneNumber,
      openingTime,
      closingTime,
      basePricePerUnit,
      turnaroundTimeD,
      turnaroundTimeH,
      bloodTypeAvailability
    }

    if (defPhoneNumber == phoneNumber &&
        defOpeningTime == dateToTimeMapping(openingTime) &&
        defClosingTime == dateToTimeMapping(closingTime) &&
        defPricePerUnit == basePricePerUnit &&
        defTurnaroundTimeD == turnaroundTimeD &&
        defTurnaroundTimeH == turnaroundTimeH &&
        defA_P  == A_P &&
        defA_N  == A_N &&
        defB_P  == B_P &&
        defB_N  == B_N &&
        defO_P  == O_P &&
        defO_N  == O_N &&
        defAB_P == AB_P &&
        defAB_N == AB_N &&
        defDivisionID == divisionID && 
        defDivisionName == divisionName 
      ) {
      return fail(422, { 
          error: "No changes made",
          description: "button",
          success: false  
        });
    }

    if (divisionID && divisionName) {
      service.division = {divisionID : divisionID, name: divisionName}
    }

    bloodBankDAO.update(serviceID, facilityID, employeeID, service)

    return {
      success: true
    }
  },

  editERService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();
    let serviceID = data.get('serviceID');

    if (!serviceID) {
      return fail(422, { 
        error: "Service not found",
        description: "serviceID",
        success: false  
      });
    }

    serviceID = String(serviceID)

    const serviceInfo = await eRDAO.getInformation(serviceID);

    const defPhoneNumber          : String | undefined = serviceInfo.phoneNumber;
    const defLoad                 : Load   = serviceInfo.load;
    const defAvailableBeds        : Number = serviceInfo.availableBeds;
    const defNonUrgentPatients    : Number = serviceInfo.nonUrgentPatients;
    const defNonUrgentQueueLength : Number = serviceInfo.nonUrgentQueueLength;
    const defUrgentPatients       : Number = serviceInfo.urgentPatients;
    const defUrgentQueueLength    : Number = serviceInfo.urgentQueueLength;
    const defCriticalPatients     : Number = serviceInfo.criticalPatients;
    const defCriticalQueueLength  : Number = serviceInfo.criticalQueueLength;
    
    const defDivisionName: string | undefined = serviceInfo.division?.name
    const defDivisionID: string | undefined = serviceInfo.division?.divisionID

    let phoneNumber: string
    const load: Load = data.get('load') as Load
    let availableBeds: number
    let nonUrgentPatients: number
    let nonUrgentQueueLength: number
    let urgentPatients: number
    let urgentQueueLength: number
    let criticalPatients: number
    let criticalQueueLength: number

    let divisionName: string | undefined = data.get('divisionName') === null ? undefined : data.get('divisionName') as string
    let divisionID: string | undefined = data.get('divisionID') === null ? undefined : data.get('divisionID') as string

    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
      
      availableBeds = validateInteger(data.get('availableBeds'), "Available Beds");
      
      nonUrgentPatients = validateInteger(data.get('nonUrgentPatients'), "Non Urgent Patients");
      nonUrgentQueueLength = validateInteger(data.get('nonUrgentQueueLength'), "Non Urgent Queue Length");
      
      urgentPatients = validateInteger(data.get('urgentPatients'), "Urgent Patients");
      urgentQueueLength = validateInteger(data.get('urgentQueueLength'), "Urgent Queue Length");
      
      criticalPatients = validateInteger(data.get('criticalPatients'), "Critical Patients");
      criticalQueueLength = validateInteger(data.get('criticalQueueLength'), "Critical Queue Length");

    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }


    const service: ERServiceDTO = {
      phoneNumber          ,
      load                 ,
      availableBeds        ,
      nonUrgentPatients    ,
      nonUrgentQueueLength ,
      urgentPatients       ,
      urgentQueueLength    ,
      criticalPatients     ,
      criticalQueueLength  
    }

    if (defPhoneNumber          == phoneNumber &&
        defLoad                 == load &&
        defAvailableBeds        == availableBeds &&
        defNonUrgentPatients    == nonUrgentPatients &&
        defNonUrgentQueueLength == nonUrgentQueueLength &&
        defUrgentPatients       == urgentPatients &&
        defUrgentQueueLength    == urgentQueueLength &&
        defCriticalPatients     == criticalPatients &&
        defCriticalQueueLength  == criticalQueueLength &&
        defDivisionID           == divisionID && 
        defDivisionName         == divisionName 
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }
    if (divisionID && divisionName) {
      service.division = {divisionID : divisionID, name: divisionName}
    }

    eRDAO.update(serviceID, facilityID, employeeID, service)

    return {
      success: true
    }
  },

  editICUService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();
    let serviceID = data.get('serviceID');

    if (!serviceID) {
      return fail(422, { 
        error: "Service not found",
        description: "serviceID",
        success: false  
      });
    }

    serviceID = String(serviceID)

    const serviceInfo = await iCUDAO.getInformation(serviceID);

    const defPhoneNumber: String | undefined = serviceInfo.phoneNumber
    const defBaseRate: Number = serviceInfo.baseRate
    const defLoad: Load = serviceInfo.load
    const defAvailableBeds: Number = serviceInfo.availableBeds
    const defCardiacSupport: boolean = serviceInfo.cardiacSupport
    const defNeurologicalSupport: boolean = serviceInfo.neurologicalSupport
    const defRenalSupport: boolean = serviceInfo.renalSupport
    const defRespiratorySupport: boolean = serviceInfo.respiratorySupport
    
    const defDivisionName: string | undefined = serviceInfo.division?.name
    const defDivisionID: string | undefined = serviceInfo.division?.divisionID

    let phoneNumber: string
    let baseRate: number
    const load: Load = data.get('load') as Load
    let availableBeds: number
    let cardiacSupport: boolean
    let neurologicalSupport: boolean
    let renalSupport: boolean
    let respiratorySupport: boolean
    
    let divisionName: string | undefined = data.get('divisionName') === null ? undefined : data.get('divisionName') as string
    let divisionID: string | undefined = data.get('divisionID') === null ? undefined : data.get('divisionID') as string

    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
      baseRate = validateFloat(data.get('price'), "Base Rate");
      availableBeds = validateInteger(data.get('availableBeds'), "Available Beds");

    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    cardiacSupport      = (data.get('cardiacSupport') ?? '') === 'on'
    neurologicalSupport = (data.get('neurologicalSupport') ?? '') === 'on'
    renalSupport        = (data.get('renalSupport') ?? '') === 'on'
    respiratorySupport  = (data.get('respiratorySupport') ?? '') === 'on'

    const service: ICUServiceDTO = {
      phoneNumber         ,
      baseRate            ,
      load                ,
      availableBeds       ,
      cardiacSupport      ,
      neurologicalSupport ,
      renalSupport        ,
      respiratorySupport  
    }

    if (defPhoneNumber          == phoneNumber &&
        defBaseRate             == baseRate &&
        defLoad                 == load &&
        defAvailableBeds        == availableBeds &&
        defCardiacSupport       == cardiacSupport &&
        defNeurologicalSupport  == neurologicalSupport &&
        defRenalSupport         == renalSupport &&
        defRespiratorySupport   == respiratorySupport &&
        defDivisionID           == divisionID && 
        defDivisionName         == divisionName
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }
    if (divisionID && divisionName) {
      service.division = {divisionID : divisionID, name: divisionName}
    }

    iCUDAO.update(serviceID, facilityID, employeeID, service)

    return {
      success: true
    }
  },

  editOPService: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const employeeID = cookies.get('employeeID');
    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();
    let serviceID = data.get('serviceID');

    if (!serviceID) {
      return fail(422, { 
        error: "Service not found",
        description: "serviceID",
        success: false  
      });
    }

    serviceID = String(serviceID)

    const serviceInfo = await outpatientDAO.getInformation(serviceID);

    const type: string = serviceInfo.type
    const defPrice: Number = serviceInfo.basePrice
    const defCompletionTimeD: Number = serviceInfo.completionTimeD
    const defCompletionTimeH: Number = serviceInfo.completionTimeH
    const defIsAvailable: boolean = serviceInfo.isAvailable
    const defAcceptsWalkIns: boolean = serviceInfo.acceptsWalkIns
    
    const defDivisionName: string | undefined = serviceInfo.division?.name
    const defDivisionID: string | undefined = serviceInfo.division?.divisionID

    let basePrice: number
    let completionTimeD: number
    let completionTimeH: number
    const isAvailable: boolean = (data.get('isAvailable') ?? '') === 'on'
    const acceptsWalkIns: boolean = (data.get('acceptsWalkIns') ?? '') === 'on'
    
    let divisionName: string | undefined = data.get('divisionName') === null ? undefined : data.get('divisionName') as string
    let divisionID: string | undefined = data.get('divisionID') === null ? undefined : data.get('divisionID') as string

    try {
      basePrice = validateFloat(data.get('price'), "Base Rate");
      let TTime = validateCompletionTime(data.get('completionDays'), data.get('completionHours'), "Completion")
      completionTimeD = TTime.days
      completionTimeH = TTime.hours
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        success: false
      });
    }

    const service: OutpatientServiceDTO = {
      type,
      basePrice             ,
      completionTimeD       ,
      completionTimeH       ,
      isAvailable           ,
      acceptsWalkIns        ,
    }

    if (defPrice == basePrice &&
        defCompletionTimeD == completionTimeD &&
        defCompletionTimeH == completionTimeH &&
        defIsAvailable == isAvailable &&
        defAcceptsWalkIns == acceptsWalkIns &&
        defDivisionID == divisionID && 
        defDivisionName == divisionName
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }
    if (divisionID && divisionName) {
      service.division = {divisionID : divisionID, name: divisionName}
    }

    outpatientDAO.update(serviceID, facilityID, employeeID, service)

    return {
      success: true
    }
  }
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

