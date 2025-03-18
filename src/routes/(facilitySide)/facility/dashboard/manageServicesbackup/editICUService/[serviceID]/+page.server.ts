import { fail, type Actions, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { validateInteger, validateFloat, validatePhone } from '$lib/server/formValidators';
import { ICUServiceDAO } from '$lib/server/ICUDAO';
import type { ICUServiceDTO } from '$lib/server/DTOs';
import type { Load } from '@prisma/client';

const ICUDAO = new ICUServiceDAO()

let def_phoneNumber: String
let def_baseRate: Number
let def_load: Load
let def_availableBeds: Number
let def_cardiacSupport: boolean
let def_neurologicalSupport: boolean
let def_renalSupport: boolean
let def_respiratorySupport: boolean

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const serviceID = params.serviceID;

  const serviceInfo = await ICUDAO.getInformation(serviceID);

  def_phoneNumber         = serviceInfo.phoneNumber
  def_baseRate            = serviceInfo.baseRate
  def_load                = serviceInfo.load
  def_availableBeds       = serviceInfo.availableBeds
  def_cardiacSupport      = serviceInfo.cardiacSupport
  def_neurologicalSupport = serviceInfo.neurologicalSupport
  def_renalSupport        = serviceInfo.renalSupport
  def_respiratorySupport  = serviceInfo.respiratorySupport

  return {
    phoneNumber         : def_phoneNumber,
    baseRate            : def_baseRate,
    load                : def_load,
    availableBeds       : def_availableBeds,
    cardiacSupport      : def_cardiacSupport,
    neurologicalSupport : def_neurologicalSupport,
    renalSupport        : def_renalSupport,
    respiratorySupport  : def_respiratorySupport,
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
      availableBeds = validateInteger(data.get('availableBeds'), "Available Beds");
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

    if (def_phoneNumber         == phoneNumber &&
        def_baseRate            == baseRate &&
        def_load                == load &&
        def_availableBeds       == availableBeds &&
        def_cardiacSupport      == cardiacSupport &&
        def_neurologicalSupport == neurologicalSupport &&
        def_renalSupport        == renalSupport &&
        def_respiratorySupport  == respiratorySupport
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    ICUDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
