import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AmbulanceServiceDAO } from '$lib/server/AmbulanceDAO';
import { dateToTimeMapping } from '$lib/Mappings';
import { validateCoverageRadius, validateFloat, validateOperatingHours, validatePhone } from '$lib/server/formValidators';
import type { AmbulanceServiceDTO } from '$lib/server/DTOs';
import { Availability } from '@prisma/client';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const facilityID = cookies.get('facilityID');
  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  const ambulanceDAO = new AmbulanceServiceDAO()
  const serviceID = params.serviceID;

  const serviceInfo = await ambulanceDAO.getInformation(serviceID);

  return {
    phoneNumber       : serviceInfo.phoneNumber,
    openingTime       : dateToTimeMapping(serviceInfo.openingTime),
    closingTime       : dateToTimeMapping(serviceInfo.closingTime),
    baseRate          : serviceInfo.baseRate,
    minCoverageRadius : serviceInfo.minCoverageRadius,
    mileageRate       : serviceInfo.mileageRate,
    maxCoverageRadius : serviceInfo.maxCoverageRadius,
    availability      : serviceInfo.availability,
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
    const updatedAt: Date = new Date()

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
      updatedAt,

    }

    const dao = new AmbulanceServiceDAO();

    dao.update(serviceID, service)

    throw redirect(303, '/facility/dashboard/manageServices');
        
  }
} satisfies Actions;
