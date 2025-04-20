import { fail, redirect, type ActionFailure } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import {
        DivisionDAO, 
        ServicesDAO, 
        
        FacilityDivisionListDAO,
        facilityDivisionsPageSize, 

        AmbulanceServiceDAO,
        BloodBankServiceDAO,
        ERServiceDAO,
        ICUServiceDAO,
        OutpatientServiceDAO,

        validatePhone, 
        validateOperatingHours,
        validateFacilityName,

        type OPServiceType, 
        OPServiceTypes, 
        specializedServiceType, 

        type ServiceDTO, 
        type CreateDivisionDTO, 
        type MultiServiceDivisionsDTO,

        dateToTimeMapping,
        validateEmail,
        EmployeeDAO,
        FacilityAdminListDAO,
        type CreateAdminDTO,
        AdminDAO,
        validateAmbulance,
        validateBloodBank,
        validateER,
        validateICU,
        validateOP,
        type UpdateAdminDTO,

        ContactDAO,
      } from '$lib';
import bcrypt from 'bcryptjs';

const divisionDAO = new DivisionDAO();
const contactDAO = new ContactDAO();
const servicesDAO = new ServicesDAO();

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

  const facilityDivisionsListDAO = new FacilityDivisionListDAO()
  const paginatedDivisions = await facilityDivisionsListDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize, { updatedAt: "desc" })
    
  const linkableServices = await facilityDivisionsListDAO.getMultiServiceDivisions(facilityID);  

  const services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);
  let serviceTypes: OPServiceType[] = services.map(s => s.type);

  let availableServices: String[] = getAvailableSpecializedServices(serviceTypes)
  let availableOPServices: String[] = getAvailableOPServices(serviceTypes)

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
  }

  existingServices = linkableServices

  return {
    divisions: paginatedDivisions.results,
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
    const employeeID = cookies.get('employeeID');

    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    let facilityDivisions = await divisionDAO.getByFacility(facilityID)

    if (facilityDivisions.length === 1) {
      return fail(422, {
        error: "Cannot delete last division",
        description: "Division Validation",
        success: false
      });
    }

    try {
      let data = await request.formData();

      const divisionID = data.get('divisionID') as string;

      let serviceTransfers: Record<string, string[]> = {}

      for (var div of facilityDivisions){
        serviceTransfers[div.divisionID] = []
      }
      // services
      const divisionServices = await servicesDAO.getByDivision(divisionID)

      for (let { serviceID } of divisionServices) {
        let newDivision = (data.get(serviceID) ?? '') as string
        if (newDivision === '') {
          return fail(422, {
            error: "All services in the division must be transferred to another division",
            description: "Division Validation",
            success: false
          });
        }
        serviceTransfers[newDivision] = [...serviceTransfers[newDivision], serviceID]
      }

      // admins
      let adminTransfers: Record<string, UpdateAdminDTO>= {}

      const facilityAdminListDAO = new FacilityAdminListDAO()
      const divisionAdmins = await facilityAdminListDAO.getSingleDivisionAdmins(facilityID)

      for (let { fname, mname, lname, employeeID } of divisionAdmins.filter(d => (d.divisions ?? [{divisionID:''}])[0].divisionID === divisionID)) {
        let adminDivision = ((data.get(employeeID) ?? '') as string).split(",")
        if (adminDivision[0] === '') {
          return fail(422, {
            error: "All admins in the division must be transferred to another division",
            description: "Division Validation",
            success: false
          });
        }
        adminTransfers[employeeID] = {fname, mname, lname, divisionIDs: adminDivision}
      }

      const employeeDAO = new EmployeeDAO()
      
      const password = data.get("password") as string;

      const employee = await employeeDAO.getByID(employeeID);

      if (!employee) {
        console.error(`Employee with ID ${employeeID} not found.`);
        return fail(404, { 
          error: "Employee not found",
          description: "not_found",
          success: false  
        });
      }

      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (!passwordMatch) {
        console.log('password error')
        return fail(400, { 
          error: 'Incorrect ID-password pair',
          description: 'pass',
          success: false
        });
      }

      for (const [divisionID, serviceList] of Object.entries(serviceTransfers)) {
        if (divisionID === "delete") {
          for (let serviceID of serviceList) {
            await servicesDAO.delete(serviceID, facilityID, employeeID);
          }
        } else {
          await divisionDAO.connectServices(divisionID, serviceList)
        }
      }

      const adminDAO = new AdminDAO()

      for (const [employeeID, updateAdminDTO] of Object.entries(adminTransfers)) {
        await adminDAO.update(employeeID, updateAdminDTO)
      }

      await divisionDAO.delete(divisionID, facilityID, employeeID)
      return {
        success: true
      }
      
    } catch (error) {
      console.log(error)
      return fail(500, { 
        error: "Failed to delete division",
        description: "database",
        success: false  
      });
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
    let phoneNumber: string[]
    let email: string[] | undefined
    let openingTime: Date
    let closingTime: Date

    const divisionName = data.get('name');
    const phone = data.get('phoneNumber');
    const formEmail = data.get('email') ?? '';
    const open = data.get('opening');
    const close = data.get('closing');

    try {
      name = validateFacilityName(divisionName);

      email = [await validateEmail(formEmail)]
      if (email[0] === '') {
        email = undefined
      }

      phoneNumber = [validatePhone(phone)];

      const facilityDivisions = await divisionDAO.getByFacility(facilityID)
      for (let div of facilityDivisions) {
        if (div.name === name) {
          return fail(422, {
            error: "Duplicate name detected",
            description: "Division Validation",
            success: false
          });
        }
      }

      const allEmails = await contactDAO.getAllEmails()
      const allPhones = await contactDAO.getAllPhoneNumbers()

      for (let otherPhone of allPhones) {
        if (otherPhone === phoneNumber[0]) {
          return fail(422, {
            error: "Duplicate phone number detected",
            description: "Division Validation",
            success: false
          });
        }
      }

      if (email) {
        for (let otherEmail of allEmails) {
          if (otherEmail === email[0]) {
            return fail(422, {
              error: "Duplicate email detected",
              description: "Division Validation",
              success: false
            });
          } 
        }
      }

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

    let newServices = []

    const ambulanceDAO = new AmbulanceServiceDAO();
    const bloodBankDAO = new BloodBankServiceDAO();
    const eRDAO = new ERServiceDAO();
    const iCUDAO = new ICUServiceDAO();
    const outpatientDAO = new OutpatientServiceDAO();

    let service: any

    try {
      for (let i = 0; ; i++) {
        const serviceType = data.get('serviceType'+String(i)) as string;
        if (!serviceType) {
          break;
        }

        switch (serviceType) {
          case "Ambulance": {
            // let service: CreateAmbulanceServiceDTO
            service = validateAmbulance(data, String(i))
            newServices.push({dao: ambulanceDAO, service, type: "Ambulance"})
            break;
          }
          case "Blood Bank": {
            // let service: CreateBloodBankServiceDTO
            service = validateBloodBank(data, String(i))
            newServices.push({dao: bloodBankDAO, service, type: "Blood Bank"})
            break;
          }
          case "Emergency Room": {
            // let service: CreateERServiceDTO
            service = validateER(data, String(i))
            newServices.push({dao: eRDAO, service, type: "Emergency Room"})
            break;
          }
          case "Intensive Care Unit": {
            // let service: CreateICUServiceDTO
            service = validateICU(data, String(i))
            newServices.push({dao: iCUDAO, service, type: "Intensive Care Unit"})
            break;
          }
          case "Outpatient": {
            // let service: CreateOutpatientServiceDTO
            service = validateOP(data, String(i)) 
            newServices.push({dao: outpatientDAO, service, type: service.type})
            break;
          }
          default: {
            return fail(422, {
              error: "Invalid service type selected",
              description: "Division Validation",
              success: false
            });
          }
        }
      }
      
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "Service Validation",
        success: false
      });
    }

    for (let i = 0; i < newServices.length; i++) {
      for (let j = i+1; j < newServices.length; j++) {
        if (newServices[i].type === newServices[j].type) {
          return fail(422, {
            error: "Duplicate new services found",
            description: "Service Validation",
            success: false
          });
        }
      }
    }

    // CreateAmbulanceServiceDTO
    // CreateBloodBankServiceDTO
    // CreateERServiceDTO
    // CreateICUServiceDTO
    // CreateOutpatientServiceDTO

    let servicesToAttach = []
    let numberOfExistingServices
    let count = 0

    for (let {services} of existingServices) {
      numberOfExistingServices = services.length
      for (let {serviceID} of services) {
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

    if ((newServices.length === 0) && (servicesToAttach.length === 0)) {
      return fail(422, {
          error: "New division must have at least 1 service",
          description: "Service Validation",
          success: false
        });
    }

    const division: CreateDivisionDTO = {
      name,
      phoneNumber,
      email,
      openingTime,
      closingTime,
    }

    try {
      const divisionID = await divisionDAO.create(facilityID, employeeID, division)
      for (var newService of newServices) {
        const serviceID = await newService.dao.create(facilityID, employeeID, newService.service)
        servicesToAttach.push(serviceID)
      }

      await divisionDAO.connectServices(divisionID, servicesToAttach)
      
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
    const employeeID = cookies.get('employeeID');

    if (!facilityID || !employeeID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const divisionID = data.get('divisionID') as string;

    const division = await divisionDAO.getInformation(divisionID)

    if (!division) {
      return fail(422, {
        error: "No division found",
        description: "validation",
        success: false
      });
    }

    let defName: string = division.name
    let defPhoneNumber: string[] = division.phoneNumber
    let defEmail: string[] = division.email ?? []
    let defOpeningTime: String = dateToTimeMapping(division.openingTime)
    let defClosingTime: String = dateToTimeMapping(division.closingTime)

    let name: string
    let phoneNumber: string[]
    let email: string[] | undefined
    let openingTime: Date
    let closingTime: Date

    const divisionName = data.get('name');
    const phone = data.get('phoneNumber');
    const formEmail = data.get('email') ?? '';
    const open = data.get('opening');
    const close = data.get('closing');

    try {
      name = validateFacilityName(divisionName);

      email = [await validateEmail(formEmail)]
      if (email[0] === '') {
        email = undefined
      }

      phoneNumber = [validatePhone(phone)];

      const facilityDivisions = await divisionDAO.getByFacility(facilityID)
      let countName = 0
      for (let div of facilityDivisions) {
        if (div.name === name) {
          countName++ 
        }
        if (countName > 1) {
          return fail(422, {
            error: "Duplicate name detected",
            description: "Division Validation",
            success: false
          });
        }
      }

      const allPhones = await contactDAO.getAllPhoneNumbers()
      let countPhones = 0

      for (let otherPhone of allPhones) {
        if (otherPhone === phoneNumber[0]) {
          countPhones++ 
        }
        if (countPhones > 1) {
          return fail(422, {
            error: "Duplicate phone number detected",
            description: "Division Validation",
            success: false
          });
        }
      }

      const allEmails = await contactDAO.getAllEmails()
      let countEmails = 0

      if (email) {
        for (let otherEmail of allEmails) {
          if (otherEmail === email[0]) {
            countEmails++ 
          }
          if (countEmails > 1) {
            return fail(422, {
              error: "Duplicate email detected",
              description: "Division Validation",
              success: false
            });
          } 
        }
      }

      const OPHours = validateOperatingHours(open, close)
      openingTime = OPHours.openingTime
      closingTime = OPHours.closingTime
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    if (defName == name &&
        defPhoneNumber.toString() == phoneNumber.toString() &&
        defOpeningTime == dateToTimeMapping(openingTime) && 
        defClosingTime == dateToTimeMapping(closingTime) && 
        defEmail == email
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    const div = {
      name,
      phoneNumber,
      email,
      openingTime,
      closingTime,
    }

    await divisionDAO.update(divisionID, facilityID, employeeID, div)
    return {
      success: true
    }
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

