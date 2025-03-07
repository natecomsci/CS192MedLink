import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { dateToTimeMapping } from '$lib/Mappings';

import { validateCompletionTime, validateFloat, validateOperatingHours, validatePhone } from '$lib/server/formValidators';
import { BloodBankServiceDAO } from '$lib/server/BloodBankDAO';
import type { BloodBankServiceDTO, BloodTypeMappingDTO } from '$lib/server/DTOs';


const bloodBankDAO = new BloodBankServiceDAO()

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');
  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  const serviceID = params.serviceID;

  const serviceInfo = await bloodBankDAO.getInformation(serviceID);

  return {
    phoneNumber           : serviceInfo.phoneNumber ?? '',
    openingTime           : dateToTimeMapping(serviceInfo.openingTime),
    closingTime           : dateToTimeMapping(serviceInfo.closingTime),
    pricePerUnit          : serviceInfo.pricePerUnit ?? 0,
    turnaroundTimeD       : serviceInfo.turnaroundTimeD ?? 0,
    turnaroundTimeH       : serviceInfo.turnaroundTimeH ?? 0,
    bloodTypeAvailability : serviceInfo.bloodTypeAvailability ?? {},
  }
};

export const actions = {
  updateService: async ({ cookies, request, params }) => {
    const serviceID = params.serviceID;

    if (!serviceID) {
      return fail(422, { 
        error: "Service not found",
        description: "serviceID",
        success: false  
      });
    }

    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      return fail(422, { 
        error: "Facility not signed in.",
        description: "facility",
        success: false  
      });
    }

    const data = await request.formData();

    let phoneNumber: string
    let openingTime: Date
    let closingTime: Date
    let pricePerUnit: number
    let turnaroundTimeD: number
    let turnaroundTimeH: number

    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "phoneNumber",
        success: false
      });
    }

    try {
      let OCTime = validateOperatingHours(data.get('opening'), data.get('closing'))
      openingTime = OCTime.openingTime
      closingTime = OCTime.closingTime
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "openClose",
        success: false
      });
    }

    try {
      pricePerUnit = validateFloat(data.get('price'), "Price Per Unit");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "price",
        success: false
      });
    }

    try {
      let TTime = validateCompletionTime(data.get('turnaroundDays'), data.get('turnaroundHours'), "Turnarond")
      turnaroundTimeD = TTime.days
      turnaroundTimeH = TTime.hours
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "turnaround",
        success: false
      });
    }
    console.log(data.get('ap'))
    console.log(data.get('an'))
    console.log(data.get('bp'))
    console.log(data.get('bn'))
    console.log(data.get('op'))
    console.log(data.get('on'))
    console.log(data.get('abp'))
    console.log(data.get('abn'))

    const A_P  = (data.get('ap') ?? '') === 'on'
    const A_N  = (data.get('an') ?? '') === 'on'
    const B_P  = (data.get('bp') ?? '') === 'on'
    const B_N  = (data.get('bn') ?? '') === 'on'
    const O_P  = (data.get('op') ?? '') === 'on'
    const O_N  = (data.get('on') ?? '') === 'on'
    const AB_P = (data.get('abp') ?? '') === 'on'
    const AB_N = (data.get('abn') ?? '') === 'on'

    let bloodTypeAvailability: BloodTypeMappingDTO = {
      A_P ,
      A_N ,
      B_P ,
      B_N ,
      O_P ,
      O_N ,
      AB_P,
      AB_N,
    }

    const service: BloodBankServiceDTO = {
      phoneNumber,
      openingTime,
      closingTime,
      pricePerUnit,
      turnaroundTimeD,
      turnaroundTimeH,
      bloodTypeAvailability,
      updatedAt: new Date(),
    }

    bloodBankDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
