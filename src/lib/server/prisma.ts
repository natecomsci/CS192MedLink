import { PrismaClient } from '@prisma/client'

import { Provider, SecurityQuestion, FacilityType, Ownership, Availability, Load, ServiceType } from '@prisma/client'

import type { Region, POrC, COrM, Brgy, Address, Facility } from '@prisma/client';

// import type { CreateServiceDTO, RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO, M_UpdateGenInfoFacilityDTO } from './dtos';
import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO, M_UpdateGenInfoFacilityDTO } from './dtos';

// Initialization of Prisma

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DAOs

export interface ServiceDAO<T, U, CreateServiceDTO, UpdateServiceDTO> {
  getByID(ID: U): Promise<T>;

  create(data: CreateServiceDTO): Promise<T>;

  update(ID: U, data: UpdateServiceDTO): Promise<T>;

  delete(ID: U): Promise<boolean>;
}

export class AddressDAO {
  static async getAddressByID(addressID: string) {      
    // @paul, more apt ata na facilityID ang param dito given what we have is facility info
    // is this not redundant sa facilityDAO getAddress??
  }

  static async updateAddress(addressID: string, data: AddressDTO) {
    // @paul, as this is an update address, no need to return addressDTO, just have to return success or not (or no return if dito ang checking)

  }

  async getRegions(): Promise<RegionDTO[]> {
    const regions = await prisma.region.findMany({
      select: {regionID: true, name: true}
    });

    return regions
  }

  async getPOrCOfRegion(regionID: number): Promise<POrCDTO[]> {
    const provinces = await prisma.pOrC.findMany({
      where: {regionID: regionID},
      select: {pOrCID: true, name: true, regionID: true}
    });

    return provinces
  }

  async getCOrMOfProvince(pOrCID: number): Promise<COrMDTO[]> {
    const cities = await prisma.cOrM.findMany({
      where: {pOrCID: pOrCID},
      select: {pOrCID: true, name: true, cOrMID: true}
    });

    return cities
  }

  async getBrgyOfCOrM(cOrMID: number): Promise<BrgyDTO[]> {
    const brgys = await prisma.brgy.findMany({
      where: {cOrMID: cOrMID},
      select: {brgyID: true, name: true, cOrMID: true}
    });

    return brgys;
  }
}

export class FacilityDAO { // call functions under these DAOs sa page.server.ts instead of writing raw commands there.

  static async updateGeneralFacilityInformation(facility: string, data: M_UpdateGenInfoFacilityDTO): Promise<Facility> {

  }

  static async getAddressByFacility(facilityID: string): Promise<AddressDTO> {
    const address = await prisma.address.findUniqueOrThrow({
      where: {facilityID: facilityID},
      select: {
        regionID: true,
        pOrCID: true,
        cOrMID: true,
        brgyID: true,
        street: true
    }});

    return address;
  }

  static async getInsurancesByFacility(facilityID: string): Promise<Provider[]> {
    const insuraceProviders = await prisma.facility.findUniqueOrThrow({
      where: {facilityID: facilityID},
      select: {acceptedProviders: true}
    });

    return insuraceProviders.acceptedProviders;
  }

  /*
  static async getServicesByFacility(facilityID: string) Promise< // to insert // > {
    
  }

  static async getAdminsByFacility(facilityID: string) Promise< // to insert // > {
    
  }

  static async getDivisionsByFacility(facilityID: string): Promise< // to insert // > {
    
  }
  */

  static async facilityHasAdmins(facilityID: string): Promise<boolean> {
    
  }

  static async facilityHasDivisions(facilityID: string): Promise<boolean> {
    
  }

}