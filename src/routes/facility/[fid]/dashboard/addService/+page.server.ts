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
        const phone     = data.get('phoneNumber');
        const open      = data.get('opening');
        const close     = data.get('closing');
        const price     = data.get('price');
        const minRange  = data.get('minCoverageRadius');
        const mileage   = data.get('mileageRate');
        const maxRange  = data.get('maxCoverageRadius');
        const avail     = data.get('availability');

        console.log(phone)
        console.log(open)
        console.log(close)
        console.log(price)
        console.log(minRange)
        console.log(mileage)
        console.log(maxRange)
        console.log(avail)

        // const service: AmbulanceData = {
        //   phone:    phone,
        //   open:     open,
        //   close:    close,
        //   price:    price,
        //   minRange: minRange,
        //   mileage:  mileage,
        //   maxRange: maxRange,
        //   avail:    avail
        // }
        break;
      }
      case "Blood Bank": {
        const phone       = data.get('phoneNumber');
        const open        = data.get('opening');
        const close       = data.get('closing');
        const price       = data.get('price');
        const turnarDay   = data.get('turnaroundDays');
        const turnarHour  = data.get('turnaroundHours');
        const Ap          = data.get('blood-A+');
        const An          = data.get('blood-A-');
        const Bp          = data.get('blood-B+');
        const Bn          = data.get('blood-B-');
        const ABp         = data.get('blood-AB+');
        const ABn         = data.get('blood-AB-');
        const Op          = data.get('blood-O+');
        const On          = data.get('blood-O-');
        const avail       = data.get('availability');

        // const service: BloodData = {}
        break;
      }
      case "Emergency Room": {
        const phone       = data.get('phoneNumber');
        const load        = data.get('load');
        const bedsAvail   = data.get('availableBeds');
        const nonAttend   = data.get('nonUrgentAttended');
        const nonQueue    = data.get('nonUrgentQueue');
        const urgAttend   = data.get('urgentAttended');
        const urgQueue    = data.get('urgentQueue');
        const crtAttend   = data.get('criticalAttended');
        const crtQueue    = data.get('criticalQueue');

        // const service: ERData = {}
        break;
      }
      case "ICU": {
        const phone       = data.get('phoneNumber');
        const price       = data.get('price');
        const bedsAvail   = data.get('availableBeds');
        const cardiac     = data.get('cardiacSupport');
        const neuro       = data.get('neurologicalSupport');
        const renal       = data.get('renalSupport');
        const resp        = data.get('respiratorySupport');

        // const service: ICUData = {}
        break;
      }
      case "Out Patient": {
        const price       = data.get('price');
        const compDay     = data.get('completionDays');
        const compHour    = data.get('completionHOURS');
        const avail       = data.get('availability');
        const walkins     = data.get('acceptWalkins');

        // const service: OPData = {}
        break;
      }
      default: {
        return fail(400, { serviceType, missing: true });
      }
    }


    return { success: true };
  }
} satisfies Actions;