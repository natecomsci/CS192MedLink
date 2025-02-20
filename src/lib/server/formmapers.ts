export interface AmbulanceData {
    phoneNumber:        string;
    openingTime:        string;
    closingTime:        string;
    baseRate:           number;
    minCoverageRadius:  number;
    mileageRate:        number;
    maxCoverageRadius:  number;
    availability:       boolean;
  };
  
  interface BloodtypeData {
    A_P:  boolean;
    A_N:  boolean;
    B_P:  boolean;
    B_N:  boolean;
    O_P:  boolean;
    O_N:  boolean;
    AB_P: boolean;
    AB_N: boolean;
  }
  
  export interface BloodData {
    phoneNumber:            string;
    openingTime:            string;
    closingTime:            string;
    pricePerUnit:           number;
    turnaroundTimeD:        number;
    turnaroundTimeH:        number;
    bloodTypeAvailability:  BloodtypeData;
  };
  
  
  export interface ERData {
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
  
  
  export interface ICUData {
    phoneNumber:          string;
    baseRate:             number;
    load:                 string;
    availableBeds:        number;
    cardiacSupport:       boolean;
    neurologicalSupport:  boolean;
    renalSupport:         boolean;
    respiratorySupport:   boolean;
  };
  
  export interface OPData {
    price:                number;
    completionTimeD:      number;
    completionTimeH:      number;
    isAvailable:          boolean;
    acceptsWalkIns:       boolean;
  };