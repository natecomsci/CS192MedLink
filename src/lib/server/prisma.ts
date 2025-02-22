import { PrismaClient } from '@prisma/client'

import { Provider, SecurityQuestion, FacilityType, Ownership, Availability, Load, ServiceType } from '@prisma/client'

import type { Region, POrC, COrM, Brgy, Address, Facility, AmbulanceService, BloodBankService, ERService, ICUService, OutpatientService } from '@prisma/client';

import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './dtos';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from './dtos';

// import type { UpdateAmbulanceServiceDTO, UpdateBloodBankServiceDTO, UpdateERServiceDTO, UpdateICUServiceDTO, UpdateOutpatientServiceDTO } from './dtos';

import type { M_UpdateGenInfoFacilityDTO } from './dtos';

// Initialization of Prisma

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DAOs

export class AmbulanceServiceDAO {
  static async getByID(facilityID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { facilityID }
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

  static async create(facilityID: string, data: CreateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      throw new Error("Could not create AmbulanceService.");
    }
  }

  //static async update(facilityID: string, data: UpdateAmbulanceServiceDTO): Promise<void> {
    
  //}

  static async delete(facilityID: string): Promise<void> {
    try {
      await prisma.ambulanceService.delete({
        where: { facilityID }
      });
    } catch (error) {
      throw new Error("Could not delete AmbulanceService.");
    }
  }
}

export class BloodBankServiceDAO {
  static async getByID(facilityID: string): Promise<BloodBankService | null> {
    try {
      const service = await prisma.bloodBankService.findUnique({
        where: { facilityID }
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

  static async create(facilityID: string, data: CreateBloodBankServiceDTO): Promise<void> {
    try {
      await prisma.bloodBankService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      throw new Error("Could not create BloodBankService.");
    }
  }

  //static async update(facilityID: string, data: UpdateBloodBankServiceDTO): Promise<void> {
    
  //}

  static async delete(facilityID: string): Promise<void> {
    try {
      await prisma.bloodBankService.delete({
        where: { facilityID }
      });

    } catch (error) {
      throw new Error("Could not delete BloodBankService.");
    }
  }
}

export class ERServiceDAO {
  static async getByID(facilityID: string): Promise<ERService | null> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { facilityID }
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
  
  static async create(facilityID: string, data: CreateERServiceDTO): Promise<void> {
    try {
      await prisma.eRService.create({
        data: { ...data, facility: { connect: { facilityID } } },
      });
    } catch (error) {
      throw new Error("Could not create ERService.");
    }
  }

  //static async update(facilityID: string, data: UpdateERServiceDTO): Promise<void> {
    
  //}

  static async delete(facilityID: string): Promise<void> {
    try {
      await prisma.eRService.delete({
        where: { facilityID }
      });

    } catch (error) {
      throw new Error("Could not delete ERService.");
    }
  }
}

export class ICUServiceDAO {
  static async getByID(facilityID: string): Promise<ICUService | null> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { facilityID }
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

  static async create(facilityID: string, data: CreateICUServiceDTO): Promise<void> {
    try {
      await prisma.iCUService.create({
        data: { ...data, facility: { connect: { facilityID } } },
      });
    } catch (error) {
      throw new Error("Could not create ICUService.");
    }
  }

  //static async update(facilityID: string, data: UpdateICUServiceDTO): Promise<void> {
    
  //}

  static async delete(facilityID: string): Promise<void> {
    try {
      const iCUServiceToDelete = await prisma.iCUService.delete({
        where: { facilityID }
      });

    } catch (error) {
      throw new Error("Could not delete ICUService.");
    }
  }
}

export class OutpatientServiceDAO {
  static async getByID(facilityID: string, serviceType: ServiceType): Promise<OutpatientService | null> {
    try {
      const service = await prisma.outpatientService.findUnique({
        where: { facilityID_serviceType: { facilityID, serviceType } }
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

  static async getAll(facilityID: string): Promise<OutpatientService[]> {
    try {
      const outpatientServices = await prisma.outpatientService.findMany({
         where: { facilityID }
        });

      return outpatientServices;
    } catch (error) {
      throw new Error("Could not retrieve OutpatientServices.");
    }
  }

  static async create(facilityID: string, data: CreateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.outpatientService.create({
        data: { ...data, facility: { connect: { facilityID } } },
      });
    } catch (error) {
      throw new Error("Could not create OutpatientService.");
    }
  }

  //static async update(facilityID: string, serviceType: ServiceType, data: UpdateOutpatientServiceDTO): Promise<void> {
    
  //}

  static async delete(facilityID: string, serviceType: ServiceType): Promise<void> {
    try {
      await prisma.outpatientService.delete({
        where: { facilityID_serviceType: { facilityID, serviceType } }
      });

    } catch (error) {
      throw new Error("Could not delete OutpatientService.");
    }
  }
}

export class AddressDAO {
  static async updateAddress(facilityID: string, data: AddressDTO): Promise<void> {
    try {
      await prisma.address.update({
        where: { facilityID },
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
  
  static async getPOrCOfRegion(regionID: number): Promise<POrCDTO[]> {
    try {
      const pOrC = await prisma.pOrC.findMany({
        where: { regionID },
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

  static async getCOrMOfProvince(pOrCID: number): Promise<COrMDTO[]> {
    try {
      const cOrMs = await prisma.cOrM.findMany({
        where: { pOrCID },
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

  static async getBrgyOfCOrM(cOrMID: number): Promise<BrgyDTO[]> {
    try {
      const brgys = await prisma.brgy.findMany({
        where: { cOrMID },
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

export class FacilityDAO {
  /*
  static async updateGeneralInformation(facility: string, data: M_UpdateGenInfoFacilityDTO): {

  }
  static async updatePassword(facility: string, data: M_UpdatePasswordFacilityDTO): {

  }

  static async getAddressByFacility(facilityID: string): Promise<AddressDTO> {
    
  }

  static async getInsurancesByFacility(facilityID: string): Promise<Provider[]> {
    
  }

  static async getServicesByFacility(facilityID: string) Promise< // to insert // > {
    
  }

  static async getAdminsByFacility(facilityID: string) Promise< // to insert // > {
    
  }

  static async getDivisionsByFacility(facilityID: string): Promise< // to insert // > {
    
  }

  static async facilityHasAdmins(facilityID: string): Promise<boolean> {
    
  }

  static async facilityHasDivisions(facilityID: string): Promise<boolean> {
    
  }
  */
}