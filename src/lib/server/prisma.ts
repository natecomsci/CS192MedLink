import { PrismaClient } from '@prisma/client'

import { Provider, SecurityQuestion, FacilityType, Ownership, Availability, Load, ServiceType } from '@prisma/client'

import type { Region, POrC, COrM, Brgy, Address, Facility } from '@prisma/client';

import type { CreateServiceDTO, RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO, M_UpdateGenInfoFacilityDTO } from './dtos';

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

  }

  static async updateAddress(addressID: string, data: AddressDTO): Promise<AddressDTO> {

  }

  static async getPOrCOfRegion(regionID: number): Promise<POrCDTO[]> {

  }

  static async getCOrMOfProvince(pOrCID: number): Promise<COrMDTO[]> {

  }

  static async getBrgyOfCOrM(cOrMID: number): Promise<BrgyDTO[]> {

  }
}

export class FacilityDAO { // call functions under these DAOs sa page.server.ts instead of writing raw commands there.

  static async updateGeneralFacilityInformation(facility: string, data: M_UpdateGenInfoFacilityDTO): Promise<Facility> {

  }

  static async getAddressByFacility(facilityID: string): Promise<AddressDTO> {
    
  }

  static async getInsurancesByFacility(facilityID: string): Promise<Provider[]> {
    
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