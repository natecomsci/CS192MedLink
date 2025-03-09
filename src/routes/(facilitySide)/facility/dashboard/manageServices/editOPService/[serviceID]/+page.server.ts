import { fail, type Actions, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { validateFloat, validateCompletionTime } from '$lib/server/formValidators';
import { OutpatientServiceDAO } from '$lib/server/OutpatientDAO';
import type { OutpatientServiceDTO } from '$lib/server/DTOs';

const OPDAO = new OutpatientServiceDAO()

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');
  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  const serviceID = params.serviceID;

  const serviceInfo = await OPDAO.getInformation(serviceID);

  return {
    price           : serviceInfo.price,
    completionTimeD : serviceInfo.completionTimeD,
    completionTimeH : serviceInfo.completionTimeH,
    isAvailable     : serviceInfo.isAvailable,
    acceptsWalkIns  : serviceInfo.acceptsWalkIns,
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

    let price: number
    let completionTimeD: number
    let completionTimeH: number
    const isAvailable: boolean = (data.get('availability') ?? '') === 'on'
    const acceptsWalkIns: boolean = (data.get('acceptWalkins') ?? '') === 'on'

    try {
      price = validateFloat(data.get('price'), "Base Rate");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "price",
        success: false
      });
    }

    try {
      let TTime = validateCompletionTime(data.get('completionDays'), data.get('completionHours'), "Completion")
      completionTimeD = TTime.days
      completionTimeH = TTime.hours
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "turnaround",
        success: false
      });
    }

    const service: OutpatientServiceDTO = {
      price                 ,
      completionTimeD       ,
      completionTimeH       ,
      isAvailable           ,
      acceptsWalkIns        ,

    }

    OPDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
