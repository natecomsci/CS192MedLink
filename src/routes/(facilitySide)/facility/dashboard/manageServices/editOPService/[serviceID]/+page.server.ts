import { fail, type Actions, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { validateInteger, validateFloat, validatePhone, validateCompletionTime } from '$lib/server/formValidators';
import { OutpatientServiceDAO } from '$lib/server/OutpatientDAO';
import type { OutpatientServiceDTO } from '$lib/server/DTOs';
import type { ServiceType } from '@prisma/client';

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
    serviceType     : serviceInfo.serviceType ?? '',
    price           : serviceInfo.price ?? 0,
    completionTimeD : serviceInfo.completionTimeD ?? 0,
    completionTimeH : serviceInfo.completionTimeH ?? 0,
    isAvailable     : serviceInfo.isAvailable ?? false,
    acceptsWalkIns  : serviceInfo.acceptsWalkIns ?? false,
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

    const serviceType: ServiceType = data.get('OPserviceType') as ServiceType
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
      serviceType           ,
      price                 ,
      completionTimeD       ,
      completionTimeH       ,
      isAvailable           ,
      acceptsWalkIns        ,
      updatedAt: new Date() ,

    }

    OPDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
