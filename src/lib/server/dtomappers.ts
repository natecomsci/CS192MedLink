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
      throw new Error("Error: One or more data unavailable.");
    }
  
    return {
      regionID : parseInt(regionID as string),
      pOrCID   : parseInt(pOrCID as string),
      cOrMID   : parseInt(cOrMID as string),
      brgyID   : parseInt(brgyID as string),
      street   : street as string,
    };
  }