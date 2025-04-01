import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';

import { 
  dateToTimeMapping,
  AmbulanceServiceDAO,
  BloodBankServiceDAO,
  ERServiceDAO,
  ICUServiceDAO,
  OutpatientServiceDAO,
} from '$lib';

const ambulanceDAO = new AmbulanceServiceDAO();
const bloodBankDAO = new BloodBankServiceDAO();
const eRDAO = new ERServiceDAO();
const iCUDAO = new ICUServiceDAO();
const outpatientDAO = new OutpatientServiceDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { serviceID, serviceType } : { serviceID: string, serviceType: string } = await request.json();

  let serviceInfo

  switch (serviceType){
    case "Ambulance":
      serviceInfo = await ambulanceDAO.getInformation(serviceID);

      return json({
          phoneNumber       : serviceInfo.phoneNumber,
          openingTime       : dateToTimeMapping(serviceInfo.openingTime),
          closingTime       : dateToTimeMapping(serviceInfo.closingTime),
          baseRate          : serviceInfo.baseRate,
          minCoverageRadius : serviceInfo.minCoverageRadius,
          mileageRate       : serviceInfo.mileageRate,
          maxCoverageRadius : serviceInfo.maxCoverageRadius,
          availability      : serviceInfo.availability,
        })

    case "Blood Bank":
      serviceInfo = await bloodBankDAO.getInformation(serviceID);

      return json({
          phoneNumber           : serviceInfo.phoneNumber,
          openingTime           : dateToTimeMapping(serviceInfo.openingTime),
          closingTime           : dateToTimeMapping(serviceInfo.closingTime),
          pricePerUnit          : serviceInfo.pricePerUnit,
          turnaroundTimeD       : serviceInfo.turnaroundTimeD,
          turnaroundTimeH       : serviceInfo.turnaroundTimeH,
          bloodTypeAvailability : serviceInfo.bloodTypeAvailability,
        })
      
    case "Emergency Room":
      serviceInfo = await eRDAO.getInformation(serviceID);

      return json({
          phoneNumber          : serviceInfo.phoneNumber,
          load                 : serviceInfo.load,
          availableBeds        : serviceInfo.availableBeds,
          nonUrgentPatients    : serviceInfo.nonUrgentPatients,
          nonUrgentQueueLength : serviceInfo.nonUrgentQueueLength,
          urgentPatients       : serviceInfo.urgentPatients,
          urgentQueueLength    : serviceInfo.urgentQueueLength,
          criticalPatients     : serviceInfo.criticalPatients,
          criticalQueueLength  : serviceInfo.criticalQueueLength,
        })

    case "Intensive Care Unit":
      serviceInfo = await iCUDAO.getInformation(serviceID);

      return json({
          phoneNumber         : serviceInfo.phoneNumber,
          baseRate            : serviceInfo.baseRate,
          load                : serviceInfo.load,
          availableBeds       : serviceInfo.availableBeds,
          cardiacSupport      : serviceInfo.cardiacSupport,
          neurologicalSupport : serviceInfo.neurologicalSupport,
          renalSupport        : serviceInfo.renalSupport,
          respiratorySupport  : serviceInfo.respiratorySupport,
        })

    case "Outpatient":
      serviceInfo = await outpatientDAO.getInformation(serviceID);

      return json({
          price           : serviceInfo.price,
          completionTimeD : serviceInfo.completionTimeD,
          completionTimeH : serviceInfo.completionTimeH,
          isAvailable     : serviceInfo.isAvailable,
          acceptsWalkIns  : serviceInfo.acceptsWalkIns,
        })
    default:
      return json({error: "No service found"})
  }
};