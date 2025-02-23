import { PrismaClient } from '@prisma/client'

import { Provider, SecurityQuestion, FacilityType, Ownership, Availability, Load, ServiceType } from '@prisma/client'

import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './dtos';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from './dtos';

import type { UpdateAmbulanceServiceDTO, UpdateBloodBankServiceDTO, UpdateERServiceDTO, UpdateICUServiceDTO, UpdateOutpatientServiceDTO } from './dtos';

import type { M_UpdateGenInfoFacilityDTO } from './dtos';

function getField(formData: FormData, field: string) {
  const value = formData.get(field);

  if (!value) 
    throw new Error(`Error: Missing ${field} field.`);

  return value;
}

function getNumber(formData: FormData, field: string): number {
  const value = getField(formData, field) as string;

  const parse = Number(value);

  if (Number.isNaN(parse)) 
    throw new Error(`Error: '${field}' must be a valid number.`);

  return parse;
}

export function mapFDataToCAmbulanceServiceDTO(formData: FormData): CreateAmbulanceServiceDTO {
  return {
    phoneNumber       : getField(formData, "phoneNumber") as string,
    openingTime       : getField(formData, "opening") as string,
    closingTime       : getField(formData, "closing") as string,
    baseRate          : getNumber(formData, "price"),
    minCoverageRadius : getNumber(formData, "minCoverageRadius"),
    mileageRate       : getNumber(formData, "mileageRate"),
    maxCoverageRadius : getNumber(formData, "maxCoverageRadius"),
  };
}

export function mapFDataToCBloodBankServiceDTO(formData: FormData): CreateBloodBankServiceDTO {
  return {
    phoneNumber     : getField(formData, "phoneNumber") as string,
    openingTime     : getField(formData, "opening") as string,
    closingTime     : getField(formData, "closing") as string,
    pricePerUnit    : getNumber(formData, "price"),
    turnaroundTimeD : getNumber(formData, "turnaroundDays"),
    turnaroundTimeH : getNumber(formData, "turnaroundHours"),
  };
}

export function mapFDataToCERServiceDTO(formData: FormData): CreateERServiceDTO {
  return { phoneNumber : getField(formData, "phoneNumber") as string };
}

export function mapFormDataToICUServiceDTO(formData: FormData): CreateICUServiceDTO {
  return {
    phoneNumber : getField(formData, "phoneNumber") as string,
    baseRate    : getNumber(formData, "price"),
  };
}

export function mapFDataToCOutpatientServiceDTO(formData: FormData): CreateOutpatientServiceDTO {
  return {
    serviceType     : getField(formData, "OPserviceType") as ServiceType,
    price           : getNumber(formData, "price"),
    completionTimeD : getNumber(formData, "completionDays"),
    completionTimeH : getNumber(formData, "completionHOURS"), // :(
    acceptsWalkIns  : getField(formData, "acceptWalkins") === "on",
  };
}

export function mapFDataToAddressDTO(formData: FormData): AddressDTO {
  return {
    regionID : getNumber(formData, "region"),
    pOrCID   : getNumber(formData, "province"),
    cOrMID   : getNumber(formData, "city"),
    brgyID   : getNumber(formData, "brgy"),
    street   : getField(formData, "street") as string,
  };
}

export function mapFormDataToM_UpdateGenInfoFacilityDTO(formData: FormData): M_UpdateGenInfoFacilityDTO {
  return {
    name              : getField(formData, "name") as string,
    photo             : getField(formData, "facilityImage") as string,
    address           : mapFDataToAddressDTO(formData),
    phoneNumber       : getField(formData, "phoneNumber") as string,
    facilityType      : getField(formData, "facilityType") as FacilityType,
    ownership         : getField(formData, "ownership") as Ownership,
    bookingSystem     : getField(formData, "bookingSystem") as string,
    acceptedProviders : getField(formData, "acceptedProviders") as string,
  };
}

// update mappers soon check mo muna pano fr boolean