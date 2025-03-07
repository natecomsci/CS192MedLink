import { prisma } from "./prisma";

import type { FacilityServicesDTO, 
              FlatFacilityServicesDTO 
            } from './DTOs';

import { AmbulanceServiceDAO } from "./AmbulanceDAO";
import { BloodBankServiceDAO } from "./BloodBankDAO";
import { ERServiceDAO } from "./ERDAO";
import { ICUServiceDAO } from "./ICUDAO";
import { OutpatientServiceDAO } from "./OutpatientDAO";
import { serviceNameToNameMapping } from '../Mappings'

const ambulanceServiceDAO : AmbulanceServiceDAO = new AmbulanceServiceDAO();
const bloodBankServiceDAO : BloodBankServiceDAO = new BloodBankServiceDAO();
const eRServiceDAO : ERServiceDAO = new ERServiceDAO();
const iCUServiceDAO : ICUServiceDAO = new ICUServiceDAO();
const outpatientServiceDAO : OutpatientServiceDAO = new OutpatientServiceDAO();


// Because of the heterogenous nature of the services, pagination must be done in the business logic instead of natively on Prisma.

export class ServicesDAO {
  async getServicesByFacility(facilityID: string): Promise<FacilityServicesDTO> {
    try {
      const [
        ambulanceService,
        bloodBankService,
        eRService,
        iCUService,
        outpatientServices,
      ] = await Promise.all([
        ambulanceServiceDAO.getByFacility(facilityID).catch(() => null),
        bloodBankServiceDAO.getByFacility(facilityID).catch(() => null),
        eRServiceDAO.getByFacility(facilityID).catch(() => null),
        iCUServiceDAO.getByFacility(facilityID).catch(() => null),
        outpatientServiceDAO.getByFacility(facilityID),
      ]);

      return {
        ambulanceService,
        bloodBankService,
        eRService,
        iCUService,
        outpatientServices,
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get services of the facility.");
    }
  }

  /*
  Sample Outputs:

  1 OutpatientService:

  {
    "ambulanceService"   : null,
    "bloodBankService"   : null,
    "erService"          : null,
    "icuService"         : null,
    "outpatientServices" : [
      { *info on outpatientservice1*, }
    ]
  }

  No Services:

  {
    "ambulanceService"   : null,
    "bloodBankService"   : null,
    "erService"          : null,
    "icuService"         : null,
    "outpatientServices" : []
  }
  */

  async getFlatServicesByFacility(facilityID: string): Promise<FlatFacilityServicesDTO[]> {
    const services = await this.getServicesByFacility(facilityID);
  
    const flatServices: FlatFacilityServicesDTO[] = [];
  
    for (const [key, value] of Object.entries(services)) {
      if ((value !== null) && (key in serviceNameToNameMapping)) {
        flatServices.push({
          serviceID : value.serviceID,
          type      : serviceNameToNameMapping[key],
          createdAt : value.createdAt,
          updatedAt : value.updatedAt,
        });
      }
    }
  
    for (const outpatientService of services.outpatientServices) {
      flatServices.push({
        serviceID : outpatientService.serviceID,
        type      : outpatientService.serviceType,
        createdAt : outpatientService.createdAt,
        updatedAt : outpatientService.updatedAt,
      });
    }
  
    return flatServices;
  }

  /*
  async getCreatableServicesByFacility(facilityID: string): 
  Promise<{ creatableServiceTypes: string[], creatableOutpatientServices: ServiceType[]}> {
    try {
      const services = await this.getServicesByFacility(facilityID);

      let creatableServiceTypes:       string[]      = []; // removed "None" kasi cop-out solution lang sya ryt,,,
      let creatableOutpatientServices: ServiceType[] = []; // removed "None" kasi cop-out solution lang sya ryt,,,

      for (const [key, value] of Object.entries(services)) {
        if ((value === null) && (key in this.serviceMapping)) {
          creatableServiceTypes.push(this.serviceMapping[key]);
        }
      }

      let existingOutpatientServiceTypes: ServiceType[] = services.outpatientServices.map(service => service.serviceType);

      for (let serviceType of OutpatientServiceTypes) {              // serviceTypes to be imported
        if (!existingOutpatientServiceTypes.includes(serviceType)) {
          creatableOutpatientServices.push(serviceType);
        }
      }

      if (creatableOutpatientServices.length > 0) {
        creatableServiceTypes.push("Outpatient");
      }

      return { creatableServiceTypes, creatableOutpatientServices };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get creatable services.");
    }
  }

  async getCreatableServicesByFacility(facilityID: string): Promise<string[]> {
    try {
      const services = await this.getServicesByFacility(facilityID);

      let creatableServiceTypes: string[] = [];

      for (const [key, value] of Object.entries(services)) {
        if ((value === null) && (key in this.serviceMapping)) {
          creatableServiceTypes.push(this.serviceMapping[key]);
        }
      }

      let existingOutpatientServiceTypes: ServiceType[] = services.outpatientServices.map(service => service.serviceType);

      for (let serviceType of OutpatientServiceTypes) {              // serviceTypes to be imported
        if (!existingOutpatientServiceTypes.includes(serviceType)) {
          creatableServiceTypes.push(serviceType);
        }
      }

      return creatableServiceTypes;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get creatable services.");
    }
  }
  */
}
