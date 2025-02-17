import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

import type { Actions } from './$types';

type AmbulanceData = {
  phone:    string;
  open:     string;
  close:    string;
  price:    number;
  minRange: number;
  mileage:  number;
  maxRange: number;
  avail:    boolean;
};

type BloodData = {
  phone:      string;
  open:       string;
  close:      string;
  price:      number;
  turnarDay:  number;
  turnarHour: number;
  Ap:         boolean;
  An:         boolean;
  Bp:         boolean;
  Bn:         boolean;
  ABp:        boolean;
  ABn:        boolean;
  Op:         boolean;
  On:         boolean;
  avail:      boolean;
};

type ERData = {
  phone:      string;
  load:       string;
  bedsAvail:  number;
  nonAttend:  number;
  nonQueue:   number;
  urgAttend:  number;
  urgQueue:   number;
  crtAttend:  number;
  crtQueue:   number;
};

type ICUData = {
  phone:      string;
  price:      number;
  bedsAvail:  number;
  cardiac:    boolean;
  neuro:      boolean;
  renal:      boolean;
  resp:       boolean;
};

type OPData = {
  price:    number;
  compDay:  number;
  compHour: number;
  avail:    boolean;
  walkins:  boolean;
};

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    const serviceType = data.get('serviceType');
    
    switch (serviceType){
      case "Ambulance": {

        const phone     = data.get('phoneNumber') as string;
        const open      = data.get('opening') as string;
        const close     = data.get('closing') as string;
        const price     = Number(data.get('price'));
        const minRange  = Number(data.get('minCoverageRadius'));
        const mileage   = Number(data.get('mileageRate'));
        const maxRange  = Number(data.get('maxCoverageRadius'));
        const avail     = data.get('availability') === 'in';

        const service: AmbulanceData = {
          phone,
          open,
          close,
          price,
          minRange,
          mileage,
          maxRange,
          avail
        }

        console.log(service)
        break;
      }
      case "Blood Bank": {
        const phone       = data.get('phoneNumber') as string;
        const open        = data.get('opening') as string;
        const close       = data.get('closing') as string;
        const price       = Number(data.get('price'));
        const turnarDay   = Number(data.get('turnaroundDays'));
        const turnarHour  = Number(data.get('turnaroundHours'));
        const Ap          = data.get('blood-A+') === 'in';
        const An          = data.get('blood-A-') === 'in';
        const Bp          = data.get('blood-B+') === 'in';
        const Bn          = data.get('blood-B-') === 'in';
        const ABp         = data.get('blood-AB+') === 'in';
        const ABn         = data.get('blood-AB-') === 'in';
        const Op          = data.get('blood-O+') === 'in';
        const On          = data.get('blood-O-') === 'in';
        const avail       = data.get('availability') === 'in';

        const service: BloodData = {
          phone:      phone,
          open:       open,
          close:      close,
          price:      price,
          turnarDay:  turnarDay,
          turnarHour: turnarHour,
          Ap,
          An,
          Bp,
          Bn,
          ABp,
          ABn,
          Op,
          On,
          avail,
        }

        console.log(service)
        break;
      }
      case "Emergency Room": {
        const phone       = data.get('phoneNumber') as string;
        const load        = data.get('load') as string;
        const bedsAvail   = Number(data.get('availableBeds'));
        const nonAttend   = Number(data.get('nonUrgentAttended'));
        const nonQueue    = Number(data.get('nonUrgentQueue'));
        const urgAttend   = Number(data.get('urgentAttended'));
        const urgQueue    = Number(data.get('urgentQueue'));
        const crtAttend   = Number(data.get('criticalAttended'));
        const crtQueue    = Number(data.get('criticalQueue'));

        const service: ERData = {
          phone,
          load,
          bedsAvail,
          nonAttend,
          nonQueue,
          urgAttend,
          urgQueue,
          crtAttend,
          crtQueue
        }

        console.log(service)
        break;
      }
      case "ICU": {
        const phone       = data.get('phoneNumber') as string;
        const price       = Number(data.get('price'));
        const bedsAvail   = Number(data.get('availableBeds'));
        const cardiac     = data.get('cardiacSupport') === 'in';
        const neuro       = data.get('neurologicalSupport') === 'in';
        const renal       = data.get('renalSupport') === 'in';
        const resp        = data.get('respiratorySupport') === 'in';

        const service: ICUData = {
          phone,
          price,
          bedsAvail,
          cardiac,
          neuro,
          renal,
          resp
        }

        console.log(service)
        break;
      }
      case "Out Patient": {
        const price       = Number(data.get('price'));
        const compDay     = Number(data.get('completionDays'));
        const compHour    = Number(data.get('completionHOURS'));
        const avail       = data.get('availability') === 'in';
        const walkins     = data.get('acceptWalkins') === 'in';

        const service: OPData = {
          price,
          compDay,
          compHour,
          avail,
          walkins
        }

        console.log(service)
        break;
      }
      default: {
        return fail(400, { serviceType, missing: true });
      }
    }


    return { success: true };
  }
} satisfies Actions;