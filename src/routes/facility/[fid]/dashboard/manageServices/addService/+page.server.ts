import { fail } from '@sveltejs/kit';
import { getAmbulanceService } from '$lib/server/prisma';

import type { PageServerLoad, Actions } from './$types';


type AmbulanceData = {
  phoneNumber:        string;
  openingTime:        string;
  closingTime:        string;
  baseRate:           number;
  minCoverageRadius:  number;
  mileageRate:        number;
  maxCoverageRadius:  number;
  availability:       boolean;
};

type BloodData = {
  phoneNumber:      string;
  openingTime:      string;
  closingTime:      string;
  pricePerUnit:     number;
  turnaroundTimeD:  number;
  turnaroundTimeH:  number;
};

type BloodTypeData = {
  A_P:  boolean;
  A_N:  boolean;
  B_P:  boolean;
  B_N:  boolean;
  O_P:  boolean;
  O_N:  boolean;
  AB_P: boolean;
  AB_N: boolean;
}

type ERData = {
  phoneNumber:          string;
  load:                 string;
  availableBeds:        number;
  nonUrgentPatients:    number;
  nonUrgentQueueLength: number;
  urgentPatients:       number;
  urgentQueueLength:    number;
  criticalPatients:     number;
  criticalQueueLength:  number;
};


type ICUData = {
  phoneNumber:          string;
  baseRate:             number;
  load:                 string;
  availableBeds:        number;
  cardiacSupport:       boolean;
  neurologicalSupport:  boolean;
  renalSupport:         boolean;
  respiratorySupport:   boolean;
};

type OPData = {
  price:    number;
  completionTimeD:  number;
  completionTimeH: number;
  isAvailable:    boolean;
  acceptsWalkIns:  boolean;
};

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    const serviceType = data.get('serviceType');
    
    switch (serviceType){
      case "Ambulance": {

        const phoneNumber       = data.get('phoneNumber') as string;
        const openingTime       = data.get('opening') as string;
        const closingTime       = data.get('closing') as string;
        const baseRate          = Number(data.get('price'));
        const minCoverageRadius = Number(data.get('minCoverageRadius'));
        const mileageRate       = Number(data.get('mileageRate'));
        const maxCoverageRadius = Number(data.get('maxCoverageRadius'));
        const availability      = data.get('availability') === 'on';

        const service: AmbulanceData = {
          phoneNumber,
          openingTime,
          closingTime,
          baseRate,
          minCoverageRadius,
          mileageRate,
          maxCoverageRadius,
          availability
        }

        // console.log(service)
        break;
      }
      case "Blood Bank": {
        const phoneNumber       = data.get('phoneNumber') as string;
        const openingTime        = data.get('opening') as string;
        const closingTime       = data.get('closing') as string;
        const pricePerUnit       = Number(data.get('price'));
        const turnaroundTimeD   = Number(data.get('turnaroundDays'));
        const turnaroundTimeH  = Number(data.get('turnaroundHours'));
        const A_P          = data.get('blood-A+') === 'on';
        const A_N          = data.get('blood-A-') === 'on';
        const B_P          = data.get('blood-B+') === 'on';
        const B_N          = data.get('blood-B-') === 'on';
        const O_P          = data.get('blood-O+') === 'on';
        const O_N          = data.get('blood-O-') === 'on';
        const AB_P         = data.get('blood-AB+') === 'on';
        const AB_N         = data.get('blood-AB-') === 'on';

        const service: BloodData = {
          phoneNumber,
          openingTime,
          closingTime,
          pricePerUnit,
          turnaroundTimeD,
          turnaroundTimeH
        }

        const bloodType: BloodTypeData = {
          A_P,
          A_N,
          B_P,
          B_N,
          O_P,
          O_N,
          AB_P,
          AB_N
        }
        // console.log(service)
        break;
      }
      case "Emergency Room": {
        const phoneNumber           = data.get('phoneNumber') as string;
        const load                  = data.get('load') as string;
        const availableBeds         = Number(data.get('availableBeds'));
        const nonUrgentPatients     = Number(data.get('nonUrgentAttended'));
        const nonUrgentQueueLength  = Number(data.get('nonUrgentQueue'));
        const urgentPatients        = Number(data.get('urgentAttended'));
        const urgentQueueLength     = Number(data.get('urgentQueue'));
        const criticalPatients      = Number(data.get('criticalAttended'));
        const criticalQueueLength   = Number(data.get('criticalQueue'));

        const service: ERData = {
          phoneNumber,
          load,
          availableBeds,
          nonUrgentPatients,
          nonUrgentQueueLength,
          urgentPatients,
          urgentQueueLength,
          criticalPatients,
          criticalQueueLength
        }

        // console.log(service)
        break;
      }
      case "ICU": {
        const phoneNumber         = data.get('phoneNumber') as string;
        const baseRate            = Number(data.get('price'));
        const load                = data.get('load') as string;
        const availableBeds       = Number(data.get('availableBeds'));
        const cardiacSupport      = data.get('cardiacSupport') === 'on';
        const neurologicalSupport = data.get('neurologicalSupport') === 'on';
        const renalSupport        = data.get('renalSupport') === 'on';
        const respiratorySupport  = data.get('respiratorySupport') === 'on';

        const service: ICUData = {
          phoneNumber,
          baseRate,
          load,
          availableBeds,
          cardiacSupport,
          neurologicalSupport,
          renalSupport,
          respiratorySupport
        }

        // console.log(service)
        break;
      }
      case "Out Patient": {
        const price           = Number(data.get('price'));
        const completionTimeD = Number(data.get('completionDays'));
        const completionTimeH = Number(data.get('completionHOURS'));
        const isAvailable     = data.get('availability') === 'on';
        const acceptsWalkIns  = data.get('acceptWalkins') === 'on';

        const service: OPData = {
          price,
          completionTimeD,
          completionTimeH,
          isAvailable,
          acceptsWalkIns
        }

        // console.log(service)
        break;
      }
      default: {
        return fail(400, { serviceType, missing: true });
      }
    }
    console.log(await getAmbulanceService("0"))

    // send data to db

    return { success: true };
  }
} satisfies Actions;