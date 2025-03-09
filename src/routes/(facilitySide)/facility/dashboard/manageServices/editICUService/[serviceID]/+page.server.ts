import { fail, type Actions, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { validateInteger, validateFloat, validatePhone } from '$lib/server/formValidators';
import { ICUServiceDAO } from '$lib/server/ICUDAO';
import type { ICUServiceDTO } from '$lib/server/DTOs';
import type { Load } from '@prisma/client';

const ICUDAO = new ICUServiceDAO()

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');
  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  const serviceID = params.serviceID;

  const serviceInfo = await ICUDAO.getInformation(serviceID);

  return {
    phoneNumber         : serviceInfo.phoneNumber,
    baseRate            : serviceInfo.baseRate,
    load                : serviceInfo.load,
    availableBeds       : serviceInfo.availableBeds,
    cardiacSupport      : serviceInfo.cardiacSupport,
    neurologicalSupport : serviceInfo.neurologicalSupport,
    renalSupport        : serviceInfo.renalSupport,
    respiratorySupport  : serviceInfo.respiratorySupport,
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
    let baseRate: number
    const load: Load = data.get('load') as Load
    let availableBeds: number
    let cardiacSupport: boolean
    let neurologicalSupport: boolean
    let renalSupport: boolean
    let respiratorySupport: boolean

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
      baseRate = validateFloat(data.get('price'), "Base Rate");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "price",
        success: false
      });
    }

    try {
      availableBeds = validateInteger(data.get('availableBeds'), "Base Rate");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "availableBeds",
        success: false
      });
    }

    cardiacSupport      = (data.get('cardiacSupport') ?? '') === 'on'
    neurologicalSupport = (data.get('neurologicalSupport') ?? '') === 'on'
    renalSupport        = (data.get('renalSupport') ?? '') === 'on'
    respiratorySupport  = (data.get('respiratorySupport') ?? '') === 'on'

    const service: ICUServiceDTO = {
      phoneNumber         ,
      baseRate            ,
      load                ,
      availableBeds       ,
      cardiacSupport      ,
      neurologicalSupport ,
      renalSupport        ,
      respiratorySupport  ,

    }

    ICUDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
