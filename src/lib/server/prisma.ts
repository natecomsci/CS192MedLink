import { PrismaClient, Prisma } from '@prisma/client'

import { FacilityType, Ownership, Provider, ServiceType } from '@prisma/client'

import type { AmbulanceService, BloodTypeMapping, BloodBankService, ERService, ICUService, OutpatientService, Address, Facility, Admin } from '@prisma/client';

import type { BloodTypeMappingDTO } from './dtos';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from './dtos';

import type { AmbulanceServiceDTO, BloodBankServiceDTO, ERServiceDTO, ICUServiceDTO, OutpatientServiceDTO } from './dtos';

import type { FacilityServicesDTO, FlatFacilityServicesDTO } from './dtos';

import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './dtos';

import type { GeneralInformationFacilityDTO } from './dtos';

import type { CreateAdminDTO, InitialAdminDetailsDTO } from './dtos';

// Initialization of Prisma

declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DAOs

export class AmbulanceServiceDAO {
  async getByID(serviceID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No AmbulanceService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async getByFacility(facilityID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No AmbulanceService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async create(facilityID: string, data: CreateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create AmbulanceService.");
    }
  }

  async getInformation(serviceID: string): Promise<AmbulanceServiceDTO> {
    try {
      const service = await this.getByID(serviceID);

      if (!service) {
        throw new Error("Missing needed AmbulanceService data.");
      }

      return {
        phoneNumber       : service.phoneNumber,
        openingTime       : service.openingTime,
        closingTime       : service.closingTime,
        baseRate          : service.baseRate,
        minCoverageRadius : service.minCoverageRadius,
        mileageRate       : service.mileageRate,
        maxCoverageRadius : service.maxCoverageRadius,
        availability      : service.availability,
        createdAt         : service.createdAt,
        updatedAt         : service.updatedAt,
      }

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for AmbulanceService.");
    }
  }

  async update(serviceID: string, data: AmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.update({
        where: { 
          serviceID 
        },
        data: {
          phoneNumber       : data.phoneNumber,
          openingTime       : data.openingTime,
          closingTime       : data.closingTime,
          baseRate          : data.baseRate,
          minCoverageRadius : data.minCoverageRadius,
          mileageRate       : data.mileageRate,
          maxCoverageRadius : data.maxCoverageRadius,
          availability      : data.availability,
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update AmbulanceService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.ambulanceService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete AmbulanceService.");
    }
  }
}

export class BloodTypeMappingDAO {
  async getBloodTypeMapping(serviceID: string): Promise<BloodTypeMappingDTO | null> {
    try {
      const bloodTypeMapping = await prisma.bloodTypeMapping.findUnique({
        where: { 
          serviceID 
        },
        select: {
          A_P  : true,
          A_N  : true,
          B_P  : true,
          B_N  : true,
          O_P  : true,
          O_N  : true,
          AB_P : true,
          AB_N : true,
        }
      });
  
      if (!bloodTypeMapping) {
        console.warn("No BloodTypeMapping found in the facility.");
        return null;
      }
  
      return bloodTypeMapping;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get BloodTypeMapping.");
    }
  }

  async createBloodTypeMapping(serviceID: string, tx: Prisma.TransactionClient): Promise<void> {
    await tx.bloodTypeMapping.create({
      data: {
        A_P  : false,
        A_N  : false,
        B_P  : false,
        B_N  : false,
        O_P  : false,
        O_N  : false,
        AB_P : false,
        AB_N : false,
  
        BloodBankService: {
          connect: {
            serviceID
          }
        }
      }
    });
  }

  async updateBloodTypeMapping(serviceID: string, data: BloodTypeMappingDTO, tx: Prisma.TransactionClient): Promise<void> {
    await tx.bloodTypeMapping.update({
      where: { 
        serviceID 
      },
      data: {
        A_P  : data.A_P,
        A_N  : data.A_N,
        B_P  : data.B_P,
        B_N  : data.B_N,
        O_P  : data.O_P,
        O_N  : data.O_N,
        AB_P : data.AB_P,
        AB_N : data.AB_N,
      }
    });
  }
}

let bloodTypeMappingDAO: BloodTypeMappingDAO = new BloodTypeMappingDAO();

export class BloodBankServiceDAO {
  async getByID(serviceID: string): Promise<BloodBankService | null> {
    try {
      const service = await prisma.bloodBankService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No BloodBankService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get BloodBankService.");
    }
  }

  async getByFacility(facilityID: string): Promise<BloodBankService | null> {
    try {
      const service = await prisma.bloodBankService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No BloodBankService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get BloodBankService.");
    }
  }  

  async create(facilityID: string, data: CreateBloodBankServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const bloodBankService = await tx.bloodBankService.create({
          data: { ...data, facility: { connect: { facilityID } } }
        });
  
        await bloodTypeMappingDAO.createBloodTypeMapping(bloodBankService.serviceID, tx);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create BloodBankService.");
    }
  }

  async getInformation(serviceID: string): Promise<BloodBankServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed BloodBankService data.");
      }
  
      const bloodTypeAvailability = await bloodTypeMappingDAO.getBloodTypeMapping(serviceID);
  
      if (!bloodTypeAvailability) {
        throw new Error("Missing needed BloodTypeAvailability data.");
      }
  
      return {
        phoneNumber           : service.phoneNumber,
        openingTime           : service.openingTime,
        closingTime           : service.closingTime,
        pricePerUnit          : service.pricePerUnit,
        turnaroundTimeD       : service.turnaroundTimeD,
        turnaroundTimeH       : service.turnaroundTimeH,
        bloodTypeAvailability : bloodTypeAvailability,
        createdAt             : service.createdAt,
        updatedAt             : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for BloodBankService.");
    }
  }

  async update(serviceID: string, data: BloodBankServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.bloodBankService.update({
          where: { 
            serviceID 
          },
          data: {
            phoneNumber     : data.phoneNumber,
            openingTime     : data.openingTime,
            closingTime     : data.closingTime,
            pricePerUnit    : data.pricePerUnit,
            turnaroundTimeD : data.turnaroundTimeD,
            turnaroundTimeH : data.turnaroundTimeH,
          }
        });

        if (data.bloodTypeAvailability) {
          await bloodTypeMappingDAO.updateBloodTypeMapping(serviceID, data.bloodTypeAvailability, tx)
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update BloodBankService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.bloodBankService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete BloodBankService.");
    }
  }
}

export class ERServiceDAO {
  async getByID(serviceID: string): Promise<ERService | null> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No ERService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ERService.");
    }
  }

  async getByFacility(facilityID: string): Promise<ERService | null> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No ERService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ERService.");
    }
  }
  
  async create(facilityID: string, data: CreateERServiceDTO): Promise<void> {
    try {
      await prisma.eRService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ERService.");
    }
  }

  async getInformation(serviceID: string): Promise<ERServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed ERService data.");
      }
  
      return {
        phoneNumber          : service.phoneNumber,
        load                 : service.load,
        availableBeds        : service.availableBeds,
        nonUrgentPatients    : service.nonUrgentPatients,
        nonUrgentQueueLength : service.nonUrgentQueueLength,
        urgentPatients       : service.urgentPatients,
        urgentQueueLength    : service.urgentQueueLength,
        criticalPatients     : service.criticalPatients,
        criticalQueueLength  : service.criticalQueueLength,
        createdAt            : service.createdAt,
        updatedAt            : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ERService.");
    }
  }  

  async update(serviceID: string, data: ERServiceDTO): Promise<void> {
    try {
      await prisma.eRService.update({
        where: { 
          serviceID 
        },
        data: {
          phoneNumber          : data.phoneNumber,
          load                 : data.load,
          availableBeds        : data.availableBeds,
          nonUrgentPatients    : data.nonUrgentPatients,
          nonUrgentQueueLength : data.nonUrgentQueueLength,
          urgentPatients       : data.urgentPatients,
          urgentQueueLength    : data.urgentQueueLength,
          criticalPatients     : data.criticalPatients,
          criticalQueueLength  : data.criticalQueueLength,
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update ERService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.eRService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete ERService.");
    }
  }
}

export class ICUServiceDAO {
  async getByID(serviceID: string): Promise<ICUService | null> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No ICUService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ICUService.");
    }
  }

  async getByFacility(facilityID: string): Promise<ICUService | null> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No ICUService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ICUService.");
    }
  }

  async create(facilityID: string, data: CreateICUServiceDTO): Promise<void> {
    try {
      await prisma.iCUService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ICUService.");
    }
  }

  async getInformation(serviceID: string): Promise<ICUServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed ICUService data.");
      }
  
      return {
        phoneNumber         : service.phoneNumber,
        baseRate            : service.baseRate,
        load                : service.load,
        availableBeds       : service.availableBeds,
        cardiacSupport      : service.cardiacSupport,
        neurologicalSupport : service.neurologicalSupport,
        renalSupport        : service.renalSupport,
        respiratorySupport  : service.respiratorySupport,
        createdAt           : service.createdAt,
        updatedAt           : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ICUService.");
    }
  }  

  async update(serviceID: string, data: ICUServiceDTO): Promise<void> {
    try {
      await prisma.iCUService.update({
        where: { 
          serviceID 
        },
        data: {
          phoneNumber         : data.phoneNumber,
          baseRate            : data.baseRate,
          load                : data.load,
          availableBeds       : data.availableBeds,
          cardiacSupport      : data.cardiacSupport,
          neurologicalSupport : data.neurologicalSupport,
          renalSupport        : data.renalSupport,
          respiratorySupport  : data.respiratorySupport,
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update ICUService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.iCUService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete ICUService.");
    }
  }
}

export class OutpatientServiceDAO {
  async getByID(serviceID: string): Promise<OutpatientService | null> {
    try {
      const service = await prisma.outpatientService.findUnique({
        where: { 
          serviceID
        }
      });
  
      if (!service) {
        console.warn("No OutpatientService with the specified ID found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get OutpatientService.");
    }
  }

  async getByFacility(facilityID: string): Promise<OutpatientService[]> {
    try {
      const outpatientServices = await prisma.outpatientService.findMany({
         where: { 
          facilityID 
        }
      });

      return outpatientServices;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get OutpatientServices.");
    }
  }

  async create(facilityID: string, data: CreateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.outpatientService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create OutpatientService.");
    }
  }

  async getInformation(serviceID: string): Promise<OutpatientServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed OutpatientService data.");
      }
  
      return {
        serviceType     : service.serviceType,
        price           : service.price,
        completionTimeD : service.completionTimeD,
        completionTimeH : service.completionTimeH,
        isAvailable     : service.isAvailable,
        acceptsWalkIns  : service.acceptsWalkIns,
        createdAt       : service.createdAt,
        updatedAt       : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for OutpatientService.");
    }
  }  

  async update(serviceID: string, data: OutpatientServiceDTO): Promise<void> {
    try {
      await prisma.outpatientService.update({
        where: { 
          serviceID  
        },
        data: {
          serviceType     : data.serviceType,
          price           : data.price,
          completionTimeD : data.completionTimeD,
          completionTimeH : data.completionTimeH,
          isAvailable     : data.isAvailable,
          acceptsWalkIns  : data.acceptsWalkIns,
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update OutpatientService.");
    }
  }

  async delete(serviceID: string, serviceType: ServiceType): Promise<void> {
    try {
      await prisma.outpatientService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete OutpatientService.");
    }
  }
}

let ambulanceServiceDAO : AmbulanceServiceDAO = new AmbulanceServiceDAO();
let bloodBankServiceDAO : BloodBankServiceDAO = new BloodBankServiceDAO();
let eRServiceDAO : ERServiceDAO = new ERServiceDAO();
let iCUServiceDAO : ICUServiceDAO = new ICUServiceDAO();
let outpatientServiceDAO : OutpatientServiceDAO = new OutpatientServiceDAO();

/* 

FOR TESTING

let OutpatientServiceTypes: ServiceType[] = [
  "CONSULTATION_GENERAL",
  "BLOOD_CHEMISTRY_BUA",
  "HEMATOLOGY_CBC",
  "CLINICAL_FECALYSIS",  
  "CLINICAL_URINALYSIS",
  "X_RAY_CHEST_PA",
  "X_RAY_C_SPINE",
  "X_RAY_T_SPINE",
  "X_RAY_L_SPINE",
  "ULTRASOUND_ABDOMINAL",
  "CT_SCAN_HEAD",
  "CT_SCAN_C_SPINE",
  "CT_SCAN_T_SPINE",
  "CT_SCAN_L_SPINE",
  "MRI_BRAIN",
  "DENTAL_SCALING",
  "THERAPY_PHYSICAL",
  "ONCOLOGY_CHEMOTHERAPY",
  "PROCEDURE_EEG",
  "PROCEDURE_ECG",
  "PROCEDURE_DIALYSIS",
  "PROCEDURE_COLONOSCOPY",
  "PROCEDURE_GASTROSCOPY",
  "PROCEDURE_LABOR_DELIVERY",
  "VACCINATION_COVID19"
]

*/

// Because of the heterogenous nature of the services, pagination must be done in the business logic instead of natively on Prisma.

export class ServicesDAO {
  serviceMapping: Record<string, string> = {
    ambulanceService : "Ambulance", 
    bloodBankService : "Blood Bank", 
    eRService : "Emergency Room", 
    iCUService : "Intensive Care Unit",
  };

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
      if ((value !== null) && (key in this.serviceMapping)) {
        flatServices.push({
          serviceID : value.serviceID,
          type      : this.serviceMapping[key],
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

export class AddressDAO {
  async updateAddress(facilityID: string, data: AddressDTO, tx: Prisma.TransactionClient): Promise<void> {
    await tx.address.update({
      where: { 
        facilityID 
      },
      data: {
        regionID : data.regionID,
        pOrCID   : data.pOrCID,
        cOrMID   : data.cOrMID,
        brgyID   : data.brgyID,
        street   : data.street,
      }
    });
  }

  async getRegions(): Promise<RegionDTO[]> {
    try {
      const regions = await prisma.region.findMany({
        select: {
          regionID : true, 
          name     : true,
        }
      });

      return regions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get regions.");
    }
  }

  async getNameOfRegion(regionID: number): Promise<string | null> {
    try {
      const object = await prisma.region.findUnique({
        where: {
          regionID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No Region found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the region.");
    }
  }

  async getProvinceOfRegion(regionID: number): Promise<POrCDTO[]> {
    try {
      const pOrC = await prisma.pOrC.findMany({
        where: {
          regionID
        },
        select: {
          pOrCID   : true,
          name     : true,
          regionID : true,
        }
      });

      return pOrC;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get provinces for the region.");
    }
  }

  async getNameOfProvince(pOrCID: number): Promise<string | null> {
    try {
      const object = await prisma.pOrC.findUnique({
        where: {
          pOrCID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No Province found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the province.");
    }
  }

  async getCOrMOfProvince(pOrCID: number): Promise<COrMDTO[]> {
    try {
      const cOrMs = await prisma.cOrM.findMany({
        where: { 
          pOrCID 
        },
        select: {
          cOrMID : true,
          name   : true,
          pOrCID : true,
        }
      });

      return cOrMs;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get cities or municipalities for the province.");
    }
  }

  async getNameOfCOrM(cOrMID: number): Promise<string | null> {
    try {
      const object = await prisma.cOrM.findUnique({
        where: {
          cOrMID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No COrM found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the city or municipality.");
    }
  }

  async getBrgyOfCOrM(cOrMID: number): Promise<BrgyDTO[]> {
    try {
      const brgys = await prisma.brgy.findMany({
        where: { 
          cOrMID 
        },
        select: {
          brgyID : true,
          name   : true,
          cOrMID : true,
        }
      });

      return brgys;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get barangays for the city or municipality.");
    }
  }

  async getNameOfBrgy(brgyID: number): Promise<string | null> {
    try {
      const object = await prisma.brgy.findUnique({
        where: {
          brgyID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No Barangay found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the barangay.");
    }
  }
}

let addressDAO: AddressDAO = new AddressDAO();

export class FacilityDAO {
  async getByID(facilityID: string): Promise<Facility | null> {
    try {
      const facility = await prisma.facility.findUnique({
        where: {
          facilityID
        }
      });

      if (!facility) {
        console.warn("No Facility found.");
        return null;
      }

      return facility;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Facility.");
    }
  }

  async getGeneralInformation(facilityID: string): Promise<GeneralInformationFacilityDTO> {
    try {
      const facility = await this.getByID(facilityID);

      if (!facility) {
        throw new Error("Missing needed Facility data.");
      }

      const address = await this.getAddressByFacility(facilityID);

      if (!address) {
        throw new Error("Missing needed Address data.");
      }

      if (!facility.email || !facility.phoneNumber || !facility.facilityType || !facility.ownership) {
        throw new Error("Facility information is incomplete.");
      }

      return {
        name              : facility.name,
        photo             : facility.photo,
        address           : address,
        email             : facility.email,
        phoneNumber       : facility.phoneNumber,
        facilityType      : facility.facilityType,
        ownership         : facility.ownership,
        acceptedProviders : facility.acceptedProviders,

        ...(facility.bookingSystem ? { bookingSystem: facility.bookingSystem } : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get general information for Facility.");
    }
  }

  async updateGeneralInformation(facilityID: string, data: GeneralInformationFacilityDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        tx.facility.update({
          where: { 
            facilityID 
          },
          data: {
            name              : data.name,
            photo             : data.photo,
            email             : data.email,
            phoneNumber       : data.phoneNumber,
            facilityType      : data.facilityType,
            ownership         : data.ownership,
            bookingSystem     : data.bookingSystem,
            acceptedProviders : data.acceptedProviders,
          }
        });

        if (data.address) {
          await addressDAO.updateAddress(facilityID, data.address, tx)
        }
      });
    } catch (error) {
      console.log("Details: ", error)
      throw new Error("Could not update general information for Facility.");
    }
  }

  async getAddressByFacility(facilityID: string): Promise<AddressDTO | null> {
    try {
      const address = await prisma.address.findUnique({
        where: { 
          facilityID 
        },
        select: {
          regionID : true,
          pOrCID   : true,
          cOrMID   : true,
          brgyID   : true,
          street   : true,
        }
      });
  
      if (!address) {
        console.warn("No Address found.");
        return null;
      }

      return address;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Address.");
    }
  }

  async getInsurancesByFacility(facilityID: string): Promise<Provider[]> {
    try {
      const facility = await this.getByID(facilityID);

      if (!facility) {
        throw new Error("Missing needed Facility data.");
      }

      return facility.acceptedProviders;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get accepted providers.");
    }
  }

  async facilityHasAdmins(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.admin.count({
        where: {
          facilityID
        }
      });

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not check if Facility has Admins.");
    }
  }

  async facilityHasDivisions(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.division.count({
        where: {
          facilityID
        }
      });

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not check if Facility has Divisions.");
    }
  }
}

/*
export class DivisionDAO {

}
*/

export class AdminDAO {
  async getByID(adminID: string): Promise<Admin | null> {
    try {
      const admin = await prisma.admin.findUnique({
        where: { 
          adminID 
        }
      });
  
      if (!admin) {
        console.warn("No Admin with the specified ID found in the facility.");
        return null;
      }
  
      return admin;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Admin.");
    }
  }

  async create(facilityID: string, data: CreateAdminDTO): Promise<InitialAdminDetailsDTO> {
    try {
      const admin = await prisma.admin.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
  
      return {
        adminID  : admin.adminID,
        fname    : admin.fname,
        lname    : admin.lname,
        password : admin.password,

        ...(admin.mname ? { mname: admin.mname } : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create Admin.");
    }
  }

  /*
  async update(adminID: string, data: AdminDTO): Promise<void> {
    try {
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Admin.");
    }
  }
  */

  async delete(adminID: string): Promise<void> {
    try {
      await prisma.admin.delete({
        where: { 
          adminID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Admin.");
    }
  }

  /*
  async getAdminsByFacility(facilityID: string): Promise<[insert]> {
  
  }

  async getPaginatedAdminsByFacility(facilityID: string): Promise<[insert]> {
  
  }

  */
}