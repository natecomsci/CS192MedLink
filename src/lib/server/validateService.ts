import { OPServiceTypes } from "$lib";
import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from "./dataLayer/DTOs";
import { validateFloat, validatePhone, validateOperatingHours, validateCoverageRadius, validateCompletionTime } from "./formValidators";

export function validateAmbulance(data: FormData, i: string | undefined): CreateAmbulanceServiceDTO{
  let phoneNumber: string
  let openingTime: Date
  let closingTime: Date
  let baseRate: number
  let minCoverageRadius: number
  let mileageRate: number
  let maxCoverageRadius: number

  const j = i === undefined ? "" : i

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'+j), "Services");

    let OCTime = validateOperatingHours(data.get('opening'+j), data.get('closing'+j))
    openingTime = OCTime.openingTime
    closingTime = OCTime.closingTime

    baseRate = validateFloat(data.get('price'+j), "Base Rate");

    let radius = validateCoverageRadius(data.get('minCoverageRadius'+j), data.get('maxCoverageRadius'+j))
    minCoverageRadius = radius.minCoverageRadius
    maxCoverageRadius = radius.maxCoverageRadius

    mileageRate = validateFloat(data.get('mileageRate'+j), "Mileage Rate");
  } catch (e) {
    throw new Error("Ambulance: " + (e as Error).message);
  }

  return  {
            phoneNumber: [phoneNumber],
            openingTime,
            closingTime,
            baseRate,
            minCoverageRadius,
            mileageRate,
            maxCoverageRadius
          }
}

export function validateBloodBank(data: FormData, i: string | undefined): CreateBloodBankServiceDTO {
  let phoneNumber: string
  let openingTime: Date
  let closingTime: Date
  let basePricePerUnit: number
  let turnaroundTimeD: number
  let turnaroundTimeH: number

  const j = i === undefined ? "" : i

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'+j), "Services");

    let OCTime = validateOperatingHours(data.get('opening'+j), data.get('closing'+j))
    openingTime = OCTime.openingTime
    closingTime = OCTime.closingTime

    basePricePerUnit = validateFloat(data.get('price'+j), "Price Per Unit");

    let TTime = validateCompletionTime(data.get('turnaroundDays'+j), data.get('turnaroundHours'+j), "Turnarond")
    turnaroundTimeD = TTime.days
    turnaroundTimeH = TTime.hours

  } catch (e) {
    throw new Error("Blood Bank: " + (e as Error).message);
  }

  return  {
            phoneNumber: [phoneNumber],
            openingTime,
            closingTime,
            basePricePerUnit,
            turnaroundTimeD,
            turnaroundTimeH
          }
}

export function validateER(data: FormData, i: string | undefined): CreateERServiceDTO {
  let phoneNumber: string

  const j = i === undefined ? "" : i

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'+j), "Services");
  } catch (e) {
    throw new Error("Emergency Room: " + (e as Error).message);
  }

  return  { phoneNumber: [phoneNumber] }
}

export function validateICU(data: FormData, i: string | undefined): CreateICUServiceDTO {
  let phoneNumber: string
  let baseRate: number

  const j = i === undefined ? "" : i

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'+j), "Services");
    baseRate = validateFloat(data.get('price'+j), "Base Rate");
  } catch (e) {
    throw new Error("Intensive Care Unit: " + (e as Error).message);
  }

  return  {
            phoneNumber: [phoneNumber],
            baseRate,
          }
}

export function validateOP(data: FormData, i: string | undefined): CreateOutpatientServiceDTO {
  let basePrice: number
  let completionTimeD: number
  let completionTimeH: number

  const j = i === undefined ? "" : i

  const OPserviceType     = data.get('OPserviceType'+j) as string;

  if (!OPServiceTypes.includes(OPserviceType)) {
    throw new Error("Invalid service type");
  }
  const acceptsWalkIns    = data.get('acceptWalkins'+j) === 'on';

  try {
    basePrice = validateFloat(data.get('price'+j), "Price");
        
    let CTime = validateCompletionTime(data.get('completionDays'+j), data.get('completionHours'+j), "Completion")
    completionTimeD = CTime.days
    completionTimeH = CTime.hours

  } catch (e) {
    throw new Error(OPserviceType + ": " + (e as Error).message);
  }

  return  {
            type: OPserviceType,
            basePrice,
            completionTimeD,
            completionTimeH,
            acceptsWalkIns
          }
}
