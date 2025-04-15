import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from "./DTOs";
import { validateFloat, validatePhone, validateOperatingHours, validateCoverageRadius, validateCompletionTime } from "./formValidators";

export function validateAmbulance(data: FormData): CreateAmbulanceServiceDTO{
  let phoneNumber: string
  let openingTime: Date
  let closingTime: Date
  let baseRate: number
  let minCoverageRadius: number
  let mileageRate: number
  let maxCoverageRadius: number

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'));

    let OCTime = validateOperatingHours(data.get('opening'), data.get('closing'))
    openingTime = OCTime.openingTime
    closingTime = OCTime.closingTime

    baseRate = validateFloat(data.get('price'), "Base Rate");

    let radius = validateCoverageRadius(data.get('minCoverageRadius'), data.get('maxCoverageRadius'))
    minCoverageRadius = radius.minCoverageRadius
    maxCoverageRadius = radius.maxCoverageRadius

    mileageRate = validateFloat(data.get('mileageRate'), "Mileage Rate");
  } catch (e) {
    throw new Error((e as Error).message);
  }

  return  {
            phoneNumber,
            openingTime,
            closingTime,
            baseRate,
            minCoverageRadius,
            mileageRate,
            maxCoverageRadius
          }
}

export function validateBloodBank(data: FormData): CreateBloodBankServiceDTO {
  let phoneNumber: string
  let openingTime: Date
  let closingTime: Date
  let basePricePerUnit: number
  let turnaroundTimeD: number
  let turnaroundTimeH: number

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'));

    let OCTime = validateOperatingHours(data.get('opening'), data.get('closing'))
    openingTime = OCTime.openingTime
    closingTime = OCTime.closingTime

    basePricePerUnit = validateFloat(data.get('price'), "Price Per Unit");

    let TTime = validateCompletionTime(data.get('turnaroundDays'), data.get('turnaroundHours'), "Turnarond")
    turnaroundTimeD = TTime.days
    turnaroundTimeH = TTime.hours

  } catch (e) {
    throw new Error((e as Error).message);
  }

  return  {
            phoneNumber,
            openingTime,
            closingTime,
            basePricePerUnit,
            turnaroundTimeD,
            turnaroundTimeH
          }
}

export function validateER(data: FormData): CreateERServiceDTO {
  let phoneNumber: string

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'));
  } catch (e) {
    throw new Error((e as Error).message);
  }

  return  { phoneNumber }
}

export function validateICU(data: FormData): CreateICUServiceDTO {
  let phoneNumber: string
  let baseRate: number

  try {
    phoneNumber = validatePhone(data.get('phoneNumber'));
    baseRate = validateFloat(data.get('price'), "Base Rate");
  } catch (e) {
    throw new Error((e as Error).message);
  }

  return  {
            phoneNumber,
            baseRate,
          }
}

export function validateOP(data: FormData): CreateOutpatientServiceDTO {
  let basePrice: number
  let completionTimeD: number
  let completionTimeH: number

  const OPserviceType     = data.get('OPserviceType') as string;
  const acceptsWalkIns    = data.get('acceptWalkins') === 'on';

  try {
    basePrice = validateFloat(data.get('price'), "Price");
        
    let CTime = validateCompletionTime(data.get('completionDays'), data.get('completionHours'), "Completion")
    completionTimeD = CTime.days
    completionTimeH = CTime.hours

  } catch (e) {
    throw new Error((e as Error).message);
  }

  return  {
            type: OPserviceType,
            basePrice,
            completionTimeD,
            completionTimeH,
            acceptsWalkIns
          }
}
