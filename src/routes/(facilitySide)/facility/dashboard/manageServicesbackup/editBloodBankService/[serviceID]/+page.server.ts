import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { dateToTimeMapping } from '$lib/Mappings';

import { validateCompletionTime, validateFloat, validateOperatingHours, validatePhone } from '$lib/server/formValidators';
import { BloodBankServiceDAO } from '$lib/server/BloodBankDAO';
import type { BloodBankServiceDTO, BloodTypeMappingDTO } from '$lib/server/DTOs';


const bloodBankDAO = new BloodBankServiceDAO()

let def_phoneNumber     : String
let def_openingTime     : String
let def_closingTime     : String
let def_pricePerUnit    : Number
let def_turnaroundTimeD : Number
let def_turnaroundTimeH : Number
let def_A_P  : boolean
let def_A_N  : boolean
let def_B_P  : boolean
let def_B_N  : boolean
let def_O_P  : boolean
let def_O_N  : boolean
let def_AB_P : boolean
let def_AB_N : boolean

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const serviceID = params.serviceID;

  const serviceInfo = await bloodBankDAO.getInformation(serviceID);

  def_phoneNumber     = serviceInfo.phoneNumber
  def_openingTime     = dateToTimeMapping(serviceInfo.openingTime)
  def_closingTime     = dateToTimeMapping(serviceInfo.closingTime)
  def_pricePerUnit    = serviceInfo.pricePerUnit
  def_turnaroundTimeD = serviceInfo.turnaroundTimeD
  def_turnaroundTimeH = serviceInfo.turnaroundTimeH

  def_A_P  = serviceInfo.bloodTypeAvailability.A_P
  def_A_N  = serviceInfo.bloodTypeAvailability.A_N
  def_B_P  = serviceInfo.bloodTypeAvailability.B_P
  def_B_N  = serviceInfo.bloodTypeAvailability.B_N
  def_O_P  = serviceInfo.bloodTypeAvailability.O_P
  def_O_N  = serviceInfo.bloodTypeAvailability.O_N
  def_AB_P = serviceInfo.bloodTypeAvailability.AB_P
  def_AB_N = serviceInfo.bloodTypeAvailability.AB_N

  return {
    phoneNumber           : def_phoneNumber,
    openingTime           : def_openingTime,
    closingTime           : def_closingTime,
    pricePerUnit          : def_pricePerUnit,
    turnaroundTimeD       : def_turnaroundTimeD,
    turnaroundTimeH       : def_turnaroundTimeH,
    bloodTypeAvailability : serviceInfo.bloodTypeAvailability,
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
      pricePerUnit = validateFloat(data.get('price'), "Price Per Unit");

      let OCTime = validateOperatingHours(data.get('opening'), data.get('closing'))
      openingTime = OCTime.openingTime
      closingTime = OCTime.closingTime

      let TTime = validateCompletionTime(data.get('turnaroundDays'), data.get('turnaroundHours'), "Turnarond")
      turnaroundTimeD = TTime.days
      turnaroundTimeH = TTime.hours
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

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
    }

    if (def_phoneNumber == phoneNumber &&
        def_openingTime == dateToTimeMapping(openingTime) &&
        def_closingTime == dateToTimeMapping(closingTime) &&
        def_pricePerUnit == pricePerUnit &&
        def_turnaroundTimeD == turnaroundTimeD &&
        def_turnaroundTimeH == turnaroundTimeH &&
        def_A_P  == A_P &&
        def_A_N  == A_N &&
        def_B_P  == B_P &&
        def_B_N  == B_N &&
        def_O_P  == O_P &&
        def_O_N  == O_N &&
        def_AB_P == AB_P &&
        def_AB_N == AB_N
      ) {
      return fail(422, { 
          error: "No changes made",
          description: "button",
          success: false  
        });
    }


    bloodBankDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
