export default function convertDate(yyyymmdd : string) {
    const year = yyyymmdd.slice(0, 4);
    const month = yyyymmdd.slice(4, 6);
    const day = yyyymmdd.slice(6, 8);
    
    return `${year}-${month}-${day}`;
}

// Utility to format dates
export function dateString(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

//string to date object
export function stringToDate(date: string): Date {
    const dateObj = new Date(date); // Date object
    return dateObj;
}
  