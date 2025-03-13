import { fail, type Actions, redirect } from '@sveltejs/kit';
import { Availability } from '@prisma/client';

import type { PageServerLoad } from './$types';
import { dateToTimeMapping } from '$lib/Mappings';

import { validateCoverageRadius, validateFloat, validateOperatingHours, validatePhone } from '$lib/server/formValidators';
import { AmbulanceServiceDAO } from '$lib/server/AmbulanceDAO';
import type { AmbulanceServiceDTO } from '$lib/server/DTOs';

const ambulanceDAO = new AmbulanceServiceDAO()

let def_phoneNumber: String
let def_openingTime: String
let def_closingTime: String
let def_baseRate: Number
let def_minCoverageRadius: Number
let def_mileageRate: Number
let def_maxCoverageRadius: Number
let def_availability: Availability

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');
  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  const serviceID = params.serviceID;

  const serviceInfo = await ambulanceDAO.getInformation(serviceID);

  def_phoneNumber       = serviceInfo.phoneNumber
  def_openingTime       = dateToTimeMapping(serviceInfo.openingTime)
  def_closingTime       = dateToTimeMapping(serviceInfo.closingTime)
  def_baseRate          = serviceInfo.baseRate
  def_minCoverageRadius = serviceInfo.minCoverageRadius
  def_mileageRate       = serviceInfo.mileageRate
  def_maxCoverageRadius = serviceInfo.maxCoverageRadius
  def_availability      = serviceInfo.availability

  return {
    phoneNumber       : def_phoneNumber,
    openingTime       : def_openingTime,
    closingTime       : def_closingTime,
    baseRate          : def_baseRate,
    minCoverageRadius : def_minCoverageRadius,
    mileageRate       : def_mileageRate,
    maxCoverageRadius : def_maxCoverageRadius,
    availability      : def_availability,
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
    let baseRate: number
    let minCoverageRadius: number
    let mileageRate: number
    let maxCoverageRadius: number
    let availability: Availability = data.get('availability') as Availability

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
      baseRate = validateFloat(data.get('price'), "Base Rate");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "price",
        success: false
      });
    }

    try {
      let radius = validateCoverageRadius(data.get('minCoverageRadius'), data.get('maxCoverageRadius'))
      minCoverageRadius = radius.minCoverageRadius
      maxCoverageRadius = radius.maxCoverageRadius
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "coverage",
        success: false
      });
    }

    try {
      mileageRate = validateFloat(data.get('mileageRate'), "Mileage Rate");
    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "mileRate",
        success: false
      });
    }

    const service: AmbulanceServiceDTO = {
      phoneNumber,
      openingTime,
      closingTime,
      baseRate,
      minCoverageRadius,
      mileageRate,
      maxCoverageRadius,
      availability, 
    }

    if (def_phoneNumber == phoneNumber &&
        def_openingTime == dateToTimeMapping(openingTime) &&
        def_closingTime == dateToTimeMapping(closingTime) &&
        def_baseRate == baseRate &&
        def_minCoverageRadius == minCoverageRadius &&
        def_mileageRate == mileageRate &&
        def_maxCoverageRadius == maxCoverageRadius &&
        def_availability == availability
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    ambulanceDAO.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
