import type { FacilityType, Ownership, Provider, SecurityQuestion, Availability, Load, ServiceType } from "@prisma/client";

export const providers: Provider[] = [
  "INTELLICARE",
  "ASIACARE",
  "AVEGA",
  "CAREWELL",
  "one_COOPHEALTH",
  "DYNAMIC_CARE_CORPORATION",
  "EASTWEST_HEALTHCARE",
  "FORTICARE",
  "GETWELL",
  "HC_and_D",
  "HEALTHFIRST",
  "HMI",
  "HPPI",
  "IWC",
  "ICARE",
  "KAISER",
  "LIFE_and_HEALTH",
  "MAXICARE",
  "MEDICARD",
  "MEDICARE",
  "MEDOCARE",
  "METROCARE",
  "OMHSI",
  "PACIFIC_CROSS",
  "PHILHEALTH",
  "VALUCARE",
  "WELLCARE",
];

export const OPServiceTypes: ServiceType[] = [
  "CONSULTATION_GENERAL",
  "BLOOD_CHEMISTRY_BUA",
  "HEMATOLOGY_CBC",
  "CLINICAL_FECALYSIS",
  "CLINICAL_URINALYSIS",
  "X_RAY_CHEST_PA",
  "X_RAY_C_SPINE",
  "X_RAY_T_SPINE",
  "X_RAY_L_SPINE",
  "ULTRASOUND_ABDOMINAL",
  "CT_SCAN_HEAD",
  "CT_SCAN_C_SPINE",
  "CT_SCAN_T_SPINE",
  "CT_SCAN_L_SPINE",
  "MRI_BRAIN",
  "DENTAL_SCALING",
  "THERAPY_PHYSICAL",
  "ONCOLOGY_CHEMOTHERAPY",
  "PROCEDURE_EEG",
  "PROCEDURE_ECG",
  "PROCEDURE_DIALYSIS",
  "PROCEDURE_COLONOSCOPY",
  "PROCEDURE_GASTROSCOPY",
  "PROCEDURE_LABOR_DELIVERY",
  "VACCINATION_COVID19",
];

/*

enum OutpatientServiceType {
  // Consultation
  CONSULTATION_GENERAL           // General Consultation

  // Laboratory - Blood Chemistry
  BLOOD_CHEMISTRY_BUA            // Blood Uric Acid Test (BUA)

  // Laboratory - Hematology
  HEMATOLOGY_CBC                 // Complete Blood Count (CBC)

  // Laboratory - Clinical Microscopy  
  CLINICAL_FECALYSIS             // Fecalysis  
  CLINICAL_URINALYSIS            // Urinalysis  

  // Imaging - X-ray  
  X_RAY_CHEST_PA                 // Chest PA X-ray
  X_RAY_C_SPINE                  // Cervical Spine X-ray
  X_RAY_T_SPINE                  // Thoracic Spine X-ray
  X_RAY_L_SPINE                  // Lumbar Spine X-ray 

  // Imaging - Ultrasound  
  ULTRASOUND_ABDOMINAL           // Abdominal Ultrasound  

  // Imaging - CT Scan
  CT_SCAN_HEAD                   // Head CT Scan (With or Without Contrast)
  CT_SCAN_C_SPINE                // Cervical Spine CT Scan
  CT_SCAN_T_SPINE                // Thoracic Spine CT Scan
  CT_SCAN_L_SPINE                // Lumbar Spine CT Scan

  // Imaging - MRI
  MRI_BRAIN                      // Brain MRI

  // Dental Procedures  
  DENTAL_SCALING                 // Oral Prophylaxis (Scaling)  

  // Rehabilitation & Therapy
  THERAPY_PHYSICAL               // Physical Therapy

  // Cancer Treatment
  ONCOLOGY_CHEMOTHERAPY          // Chemotherapy

  // Diagnostic Tests  
  PROCEDURE_EEG                  // Electroencephalogram (EEG)  
  PROCEDURE_ECG                  // Electrocardiogram (ECG)  

  // Specialized Procedures  
  PROCEDURE_DIALYSIS             // Acute Peritoneal Dialysis  
  PROCEDURE_COLONOSCOPY          // Colonoscopy  
  PROCEDURE_GASTROSCOPY          // Gastroscopy  
  PROCEDURE_LABOR_DELIVERY       // Labor and Delivery

  // Vaccinations
  VACCINATION_COVID19            // COVID-19 Vaccination
}
*/

export const securityQuestions: SecurityQuestion[]  = [
  "STREETNAME"            ,
  "FIRSTFRIENDNICKNAME"   ,
  "FAVORITEOUTDOORGAME"   ,
  "FIRSTPETNAME"          ,
  "INFLUENTIALTEACHER"    ,
  "FAVORITETVSHOW"        ,
  "FAVORITEULAM"          ,
  "UNUSUALSTREETFOOD"     ,
  "FIRSTJOB"              ,
  "MEMORABLEBIRTHDAYGIFT" ,
];

export const facilityType: FacilityType[] = [
  "BARANGAY_HEALTH_CENTER",
  "CLINIC",
  "HEALTH_CENTER",
  "HOSPITAL",
  "INFIRMARY",
  "POLYCLINIC",
  "PRIMARY_CARE_CLINIC",
  "CARDIOLOGY_CLINIC",
  "DENTAL_CLINIC",
  "DERMATOLOGY_CLINIC",
  "ENDOCRINOLOGY_CLINIC",
  "ENT_CLINIC",
  "FERTILITY_CLINIC",
  "GASTROENTEROLOGY_CLINIC",
  "IMMUNOLOGY_CENTER",
  "INFECTIOUS_DISEASE_CENTER",
  "MATERNITY_CENTER",
  "NEPHROLOGY_CLINIC",
  "NEUROLOGY_CLINIC",
  "ONCOLOGY_CENTER",
  "OPHTHALMOLOGY_CLINIC",
  "ORTHOPEDIC_CLINIC",
  "PEDIATRIC_CLINIC",
  "PULMONOLOGY_CLINIC",
  "RHEUMATOLOGY_CLINIC",
  "UROLOGY_CLINIC",
  "DIAGNOSTIC_LAB",
  "GENETIC_TESTING_LAB",
  "PATHOLOGY_LAB",
  "RADIOLOGY_CENTER",
  "BURN_CENTER",
  "CRITICAL_CARE_CENTER",
  "EMERGENCY_CENTER",
  "POISON_CONTROL_CENTER",
  "TRAUMA_CENTER",
  "URGENT_CARE_CENTER",
  "BLOOD_BANK",
  "DIALYSIS_CENTER",
  "MENTAL_HEALTH_FACILITY",
  "PAIN_MANAGEMENT_CLINIC",
  "REHABILITATION_CENTER",
  "SLEEP_CENTER",
  "SUBSTANCE_ABUSE_CENTER",
  "TRANSPLANT_CENTER",
  "ALTERNATIVE_MEDICINE_CENTER",
  "HERBAL_MEDICINE_CENTER",
  "PHYSICAL_THERAPY_CENTER",
  "AMBULATORY_CARE_CENTER",
  "SURGICAL_CENTER",
  "AMBULANCE_SERVICE",
];

export const ownership: Ownership[] = [
  "PUBLIC",
  "PRIVATE",
]

export const availability: Availability[] = [
  "AVAILABLE",
  "SHORT_DELAY",
  "MODERATE_DELAY",
  "EXTENDED_DELAY",
  "UNAVAILABLE",
];

export const load: Load[] = [
  "STEADY",
  "MODERATE",
  "CROWDED",
  "NEAR_CAPACITY",
  "FULL_CAPACITY",
  "CLOSED",
];