import { fail, type Actions, redirect } from '@sveltejs/kit';
import { Load } from '@prisma/client';

import type { PageServerLoad } from './$types';

import { validateInteger, validatePhone } from '$lib/server/formValidators';
import { ERServiceDAO } from '$lib/server/ERDAO';
import type { ERServiceDTO } from '$lib/server/DTOs';

const ERDAO = new ERServiceDAO();

let def_phoneNumber          : String
let def_load                 : Load
let def_availableBeds        : Number
let def_nonUrgentPatients    : Number
let def_nonUrgentQueueLength : Number
let def_urgentPatients       : Number
let def_urgentQueueLength    : Number
let def_criticalPatients     : Number
let def_criticalQueueLength  : Number

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const serviceID = params.serviceID;

  const serviceInfo = await ERDAO.getInformation(serviceID);

  def_phoneNumber          = serviceInfo.phoneNumber;
  def_load                 = serviceInfo.load;
  def_availableBeds        = serviceInfo.availableBeds;
  def_nonUrgentPatients    = serviceInfo.nonUrgentPatients;
  def_nonUrgentQueueLength = serviceInfo.nonUrgentQueueLength;
  def_urgentPatients       = serviceInfo.urgentPatients;
  def_urgentQueueLength    = serviceInfo.urgentQueueLength;
  def_criticalPatients     = serviceInfo.criticalPatients;
  def_criticalQueueLength  = serviceInfo.criticalQueueLength;

  return {
    phoneNumber          : def_phoneNumber,
    load                 : def_load,
    availableBeds        : def_availableBeds,
    nonUrgentPatients    : def_nonUrgentPatients,
    nonUrgentQueueLength : def_nonUrgentQueueLength,
    urgentPatients       : def_urgentPatients,
    urgentQueueLength    : def_urgentQueueLength,
    criticalPatients     : def_criticalPatients,
    criticalQueueLength  : def_criticalQueueLength,
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
    const load: Load = data.get('load') as Load
    let availableBeds: number
    let nonUrgentPatients: number
    let nonUrgentQueueLength: number
    let urgentPatients: number
    let urgentQueueLength: number
    let criticalPatients: number
    let criticalQueueLength: number


    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
      availableBeds = validateInteger(data.get('availableBeds'), "Available Beds");
      nonUrgentPatients = validateInteger(data.get('nonUrgentPatients'), "Non Urgent Patients");
      nonUrgentQueueLength = validateInteger(data.get('nonUrgentQueueLength'), "Non Urgent Queue Length");
      urgentPatients = validateInteger(data.get('urgentPatients'), "Urgent Patients");
      urgentQueueLength = validateInteger(data.get('urgentQueueLength'), "Urgent Queue Length");
      criticalPatients = validateInteger(data.get('criticalPatients'), "Critical Patients");
      criticalQueueLength = validateInteger(data.get('criticalQueueLength'), "Critical Queue Length");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }


    const service: ERServiceDTO = {
      phoneNumber          ,
      load                 ,
      availableBeds        ,
      nonUrgentPatients    ,
      nonUrgentQueueLength ,
      urgentPatients       ,
      urgentQueueLength    ,
      criticalPatients     ,
      criticalQueueLength  ,
    }

    if (def_phoneNumber          == phoneNumber &&
        def_load                 == load &&
        def_availableBeds        == availableBeds &&
        def_nonUrgentPatients    == nonUrgentPatients &&
        def_nonUrgentQueueLength == nonUrgentQueueLength &&
        def_urgentPatients       == urgentPatients &&
        def_urgentQueueLength    == urgentQueueLength &&
        def_criticalPatients     == criticalPatients &&
        def_criticalQueueLength  == criticalQueueLength
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    ERDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
