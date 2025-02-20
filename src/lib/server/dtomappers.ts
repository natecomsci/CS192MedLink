import { PrismaClient } from '@prisma/client'

import { ServiceType } from '@prisma/client'

import type { Region, POrC, COrM, Brgy, Address } from '@prisma/client';

import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './dtos';

export function mapModelToRegionDTO(region: Region): RegionDTO {
    return {
      regionID : region.regionID,
      name     : region.name,
    };
  }
  
  function mapModelToPOrCDTO(pOrC: POrC): POrCDTO {
    return {
      pOrCID   : pOrC.pOrCID,
      name     : pOrC.name,
      regionID : pOrC.regionID,
    };
  }
  
  export function mapModelToCOrMDTO(cOrM: COrM): COrMDTO {
    return {
      cOrMID : cOrM.cOrMID,
      name   : cOrM.name,
      pOrCID : cOrM.pOrCID,
    };
  }
  
  export function mapModelToBrgyDTO(brgy: Brgy): BrgyDTO {
    return {
      brgyID : brgy.brgyID,
      name   : brgy.name,
      cOrMID : brgy.cOrMID,
    };
  }
  
  export function mapModelToAddressDTO(address: Address): AddressDTO {
    return {
      regionID : address.regionID,
      pOrCID   : address.pOrCID,
      cOrMID   : address.cOrMID,
      brgyID   : address.brgyID,
      street   : address.street,
    };
  }
  
  export function mapFormDataToAddressDTO(formData: FormData): AddressDTO {
    const regionID = formData.get("regionID");
    const pOrCID   = formData.get("pOrCID");
    const cOrMID   = formData.get("cOrMID");
    const brgyID   = formData.get("brgyID");
    const street   = formData.get("street");
  
    if (!regionID || !pOrCID || !cOrMID || !brgyID || !street) {
      throw new Error("Error: One or more address fields unavailable.");
    }
  
    const parsedRegionID = parseInt(regionID as string, 10);
    const parsedPOrCID   = parseInt(pOrCID as string, 10);
    const parsedCOrMID   = parseInt(cOrMID as string, 10);
    const parsedBrgyID   = parseInt(brgyID as string, 10);
  
    if (isNaN(parsedRegionID) || isNaN(parsedPOrCID) || isNaN(parsedCOrMID) || isNaN(parsedBrgyID)) {
      throw new Error("Error: One or more address fields contain invalid numbers.");
    }
  
    return {
      regionID: parsedRegionID,
      pOrCID: parsedPOrCID,
      cOrMID: parsedCOrMID,
      brgyID: parsedBrgyID,
      street: street as string,
    };
  }