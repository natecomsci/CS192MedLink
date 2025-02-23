import { PrismaClient } from '@prisma/client'

import { ServiceType } from '@prisma/client'

import type { AmbulanceService, BloodTypeMapping, BloodBankService, ERService, ICUService, OutpatientService } from '@prisma/client';

import type { BloodTypeMappingDTO, RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './dtos';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from './dtos';

import type { UpdateAmbulanceServiceDTO, UpdateBloodBankServiceDTO, UpdateERServiceDTO, UpdateICUServiceDTO, UpdateOutpatientServiceDTO } from './dtos';

import type { M_UpdateGenInfoFacilityDTO } from './dtos';

// Initialization of Prisma

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DAOs

export class AddressDAO {
  async updateAddress(facilityID: string, data: AddressDTO): Promise<void> {
    try {
      await prisma.address.update({
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
    } catch (error) {
      throw new Error("Could not update Address.");
    }
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
    throw new Error("Could not get regions.");
  }
  }

  async getPOrCOfRegion(regionID: number): Promise<POrCDTO[]> {
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
      throw new Error("Could not get provinces for the region.");
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
      throw new Error("Could not get cities or municipalities for the province.");
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
      throw new Error("Could not get barangays for the city or municipality.");
    }
  }
}

let addressDAO: AddressDAO = new AddressDAO();

export class FacilityDAO {
  async updateGeneralInformation(facilityID: string, data: M_UpdateGenInfoFacilityDTO): Promise<void> {
    try {
      await prisma.facility.update({
        where: { 
          facilityID 
        },
        data: {
          name              : data.name,
          photo             : data.photo,
          phoneNumber       : data.phoneNumber,
          facilityType      : data.facilityType,
          ownership         : data.ownership,
          bookingSystem     : data.bookingSystem,
          acceptedProviders : data.acceptedProviders,
        }
      });

      await addressDAO.updateAddress(facilityID, data.address);

    } catch (error) {
      throw new Error("Could not update general information for Facility.");
    }
  }  

  /*
  async updatePassword(facility: string, data: M_UpdatePasswordFacilityDTO): {

  }

  async getAddressByFacility(facilityID: string): Promise<AddressDTO> {
    
  }

  async getInsurancesByFacility(facilityID: string): Promise<Provider[]> {
    
  }

  async getServicesByFacility(facilityID: string) Promise< // to insert // > {
    
  }

  async getAdminsByFacility(facilityID: string) Promise< // to insert // > {
    
  }

  async getDivisionsByFacility(facilityID: string): Promise< // to insert // > {
    
  }

  async facilityHasAdmins(facilityID: string): Promise<boolean> {
    
  }

  async facilityHasDivisions(facilityID: string): Promise<boolean> {
    
  }
  */
}

export class AmbulanceServiceDAO {
  async getByID(facilityID: string): Promise<AmbulanceService | null> {
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
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async create(facilityID: string, data: CreateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      throw new Error("Could not create AmbulanceService.");
    }
  }

  async update(facilityID: string, data: UpdateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.update({
        where: { 
          facilityID 
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
        },
      });
    } catch (error) {
      throw new Error("Could not update AmbulanceService.");
    }
  }

  async delete(facilityID: string): Promise<void> {
    try {
      await prisma.ambulanceService.delete({
        where: { 
          facilityID 
        }
      });
    } catch (error) {
      throw new Error("Could not delete AmbulanceService.");
    }
  }
}

export class BloodTypeMappingDAO {
  async getBloodTypeMapping(facilityID: string): Promise<BloodTypeMapping | null> {
    try {
      const bloodTypeMapping = await prisma.bloodTypeMapping.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!bloodTypeMapping) {
        console.warn("No BloodTypeMapping found in the facility.");
        return null;
      }
  
      return bloodTypeMapping;
    } catch (error) {
      throw new Error("Could not get BloodTypeMapping.");
    }
  }

  async createBloodTypeMapping(facilityID: string): Promise<void> {
    try {
      await prisma.bloodTypeMapping.create({
        data: {
          A_P  : false,
          A_N  : false,
          B_P  : false,
          B_N  : false,
          O_P  : false,
          O_N  : false,
          AB_P : false,
          AB_N : false,

          bloodBankService: {
            connect: {
              facilityID
            }
          }
        }
      });
    } catch (error) {
      throw new Error("Could not create BloodTypeAvailability.");
    }
  }  

  async updateBloodTypeMapping(facilityID: string, data: BloodTypeMappingDTO): Promise<void> {
    try {
      await prisma.bloodTypeMapping.update({
        where: { 
          facilityID 
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
    } catch (error) {
      throw new Error("Could not update BloodTypeMapping.");
    }
  }
}

let bloodTypeMappingDAO: BloodTypeMappingDAO = new BloodTypeMappingDAO();

export class BloodBankServiceDAO {
  async getByID(facilityID: string): Promise<BloodBankService | null> {
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
      throw new Error("Could not get BloodBankService.");
    }
  }  

  async create(facilityID: string, data: CreateBloodBankServiceDTO): Promise<void> {
    try {
      await prisma.bloodBankService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });

      await bloodTypeMappingDAO.createBloodTypeMapping(facilityID);

    } catch (error) {
      throw new Error("Could not create BloodBankService.");
    }
  }

  async update(facilityID: string, data: UpdateBloodBankServiceDTO): Promise<void> {
    try {
      await prisma.bloodBankService.update({
        where: { 
          facilityID 
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
  
      await bloodTypeMappingDAO.updateBloodTypeMapping(facilityID, data.bloodTypeAvailability);

    } catch (error) {
      throw new Error("Could not update BloodBankService.");
    }
  }

  async delete(facilityID: string): Promise<void> {
    try {
      await prisma.bloodBankService.delete({
        where: { 
          facilityID 
        }
      });
    } catch (error) {
      throw new Error("Could not delete BloodBankService.");
    }
  }
}

export class ERServiceDAO {
  async getByID(facilityID: string): Promise<ERService | null> {
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
      throw new Error("Could not get ERService.");
    }
  }
  
  async create(facilityID: string, data: CreateERServiceDTO): Promise<void> {
    try {
      await prisma.eRService.create({
        data: { ...data, facility: { connect: { facilityID } } },
      });
    } catch (error) {
      throw new Error("Could not create ERService.");
    }
  }

  async update(facilityID: string, data: UpdateERServiceDTO): Promise<void> {
    try {
      await prisma.erService.update({
        where: { 
          facilityID 
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
      throw new Error("Could not update ERService.");
    }
  }

  async delete(facilityID: string): Promise<void> {
    try {
      await prisma.eRService.delete({
        where: { 
          facilityID 
        }
      });
    } catch (error) {
      throw new Error("Could not delete ERService.");
    }
  }
}

export class ICUServiceDAO {
  async getByID(facilityID: string): Promise<ICUService | null> {
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
      throw new Error("Could not get ICUService.");
    }
  }

  async create(facilityID: string, data: CreateICUServiceDTO): Promise<void> {
    try {
      await prisma.iCUService.create({
        data: { ...data, facility: { connect: { facilityID } } },
      });
    } catch (error) {
      throw new Error("Could not create ICUService.");
    }
  }

  async update(facilityID: string, data: UpdateICUServiceDTO): Promise<void> {
    try {
      await prisma.icuService.update({
        where: { 
          facilityID 
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
      throw new Error("Could not update ICUService.");
    }
  }

  async delete(facilityID: string): Promise<void> {
    try {
      await prisma.iCUService.delete({
        where: { 
          facilityID 
        }
      });
    } catch (error) {
      throw new Error("Could not delete ICUService.");
    }
  }
}

export class OutpatientServiceDAO {
  async getByID(facilityID: string, serviceType: ServiceType): Promise<OutpatientService | null> {
    try {
      const service = await prisma.outpatientService.findUnique({
        where: { 
          facilityID_serviceType: { facilityID, serviceType } 
        }
      });
  
      if (!service) {
        console.warn("No OutpatientService with the specified type found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      throw new Error("Could not get OutpatientService.");
    }
  }

  async getAll(facilityID: string): Promise<OutpatientService[]> {
    try {
      const outpatientServices = await prisma.outpatientService.findMany({
         where: { 
          facilityID 
        }
      });

      return outpatientServices;
    } catch (error) {
      throw new Error("Could not get OutpatientServices.");
    }
  }

  async create(facilityID: string, data: CreateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.outpatientService.create({
        data: { ...data, facility: { connect: { facilityID } } },
      });
    } catch (error) {
      throw new Error("Could not create OutpatientService.");
    }
  }

  async update(facilityID: string, data: UpdateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.outpatientService.update({
        where: { 
          facilityID 
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
      throw new Error("Could not update OutpatientService.");
    }
  }

  async delete(facilityID: string, serviceType: ServiceType): Promise<void> {
    try {
      await prisma.outpatientService.delete({
        where: { 
          facilityID_serviceType: { facilityID, serviceType } 
        }
      });
    } catch (error) {
      throw new Error("Could not delete OutpatientService.");
    }
  }
}