import { fail } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from '$lib/server/dtos';
import { ServiceType } from '@prisma/client';

// export const load: PageServerLoad = async () => {
//   return {
//     OPserviceType: ServiceType
//   };
// };

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

        const service: CreateAmbulanceServiceDTO = {
          phoneNumber,
          openingTime,
          closingTime,
          baseRate,
          minCoverageRadius,
          mileageRate,
          maxCoverageRadius
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

        const service: CreateBloodBankServiceDTO = {
          phoneNumber,
          openingTime,
          closingTime,
          pricePerUnit,
          turnaroundTimeD,
          turnaroundTimeH
        }

        console.log(service)
        break;
      }
      case "Emergency Room": {
        const phoneNumber           = data.get('phoneNumber') as string;

        const service: CreateERServiceDTO = {
          phoneNumber
        }

        // console.log(service)
        break;
      }
      case "ICU": {
        const phoneNumber         = data.get('phoneNumber') as string;
        const baseRate            = Number(data.get('price'));

        const service: CreateICUServiceDTO = {
          phoneNumber,
          baseRate
        }

        // console.log(service)
        break;
      }
      case "Out Patient": {
        const OPserviceType   = data.get('OPserviceType') as ServiceType;
        const price           = Number(data.get('price'));
        const completionTimeD = Number(data.get('completionDays'));
        const completionTimeH = Number(data.get('completionHOURS'));
        const acceptsWalkIns  = data.get('acceptWalkins') === 'on';

        const service: CreateOutpatientServiceDTO = {
          serviceType: OPserviceType,
          price,
          completionTimeD,
          completionTimeH,
          acceptsWalkIns
        }

        // console.log(service)
        break;
      }
      default: {
        return fail(400, { serviceType, missing: true });
      }
    }
    // console.log(await getAmbulanceService("0"))

    // send data to db

    // console.log(await prisma.ambulanceService.findUnique( {where: { facilityID: "0eea8939-c386-46ad-95a2-12ae60740758" }} ));

    return { success: true };
  }
} satisfies Actions;