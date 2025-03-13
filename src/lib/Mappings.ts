export const serviceNameToNameMapping: Record<string, string> = {
    ambulanceService : "Ambulance", 
    bloodBankService : "Blood Bank", 
    eRService : "Emergency Room", 
    iCUService : "Intensive Care Unit",
  };

export function dateToTimeMapping(date: Date | undefined): String {
    if (!date) {
        return ''
    }
    let timeList = String(date).split(' ')[4].split(':')
    return timeList[0] + ":" + timeList[1]
}