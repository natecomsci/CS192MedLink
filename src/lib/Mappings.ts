export const serviceNameToNameMapping: Record<string, string> = {
    ambulanceService : "Ambulance", 
    bloodBankService : "Blood Bank", 
    eRService : "Emergency Room", 
    iCUService : "Intensive Care Unit",
  };

export const NameToServiceNameMapping: Record<string, string> = {
    "Ambulance" : "ambulanceService",
    "Blood Bank" : "bloodBankService",
    "Emergency Room" : "eRService",
    "Intensive Care Unit" : "iCUService",
  };

export const serviceNameToUIName: Record<string, string> = {
  "Ambulance" : "Ambulance",
  "Blood Bank" : "Blood Bank",
  "Emergency Room" : "Emergency Room",
  "Intensive Care Unit" : "Intensive Care Unit",
  "CONSULTATION_GENERAL" : "General Consultation",
  "BLOOD_CHEMISTRY_BUA" : "Blood Chemistry (BUA)",
  "HEMATOLOGY_CBC" : "Complete Blood Count (CBC)",
  "CLINICAL_FECALYSIS" : "Clinical Fecalysis",
  "CLINICAL_URINALYSIS" : "Clinical Urinalysis",
  "X_RAY_CHEST_PA" : "Chest X-Ray (PA View)",
  "X_RAY_C_SPINE" : "Cervical Spine X-Ray",
  "X_RAY_T_SPINE" : "Thoracic Spine X-Ray",
  "X_RAY_L_SPINE" : "Lumbar Spine X-Ray",
  "ULTRASOUND_ABDOMINAL" : "Abdominal Ultrasound",
  "CT_SCAN_HEAD" : "Head CT Scan",
  "CT_SCAN_C_SPINE" : "Cervical Spine CT Scan",
  "CT_SCAN_T_SPINE" : "Thoracic Spine CT Scan",
  "CT_SCAN_L_SPINE" : "Lumbar Spine CT Scan",
  "MRI_BRAIN" : "Brain MRI",
  "DENTAL_SCALING" : "Dental Scaling",
  "THERAPY_PHYSICAL" : "Physical Therapy",
  "ONCOLOGY_CHEMOTHERAPY" : "Oncology Chemotherapy",
  "PROCEDURE_EEG" : "EEG",
  "PROCEDURE_ECG" : "ECG",
  "PROCEDURE_DIALYSIS" : "Dialysis",
  "PROCEDURE_COLONOSCOPY" : "Colonoscopy",
  "PROCEDURE_GASTROSCOPY" : "Gastroscopy",
  "PROCEDURE_LABOR_DELIVERY" : "Labor & Delivery",
  "VACCINATION_COVID19" : "COVID-19 Vaccination",
};

export function dateToTimeMapping(date: Date | undefined): String {
    if (!date) {
        return ''
    }
    let timeList = String(date).split(' ')[4].split(':')
    return timeList[0] + ":" + timeList[1]
}