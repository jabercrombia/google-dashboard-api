export default function convertDate(yyyymmdd : string) {
    const year = yyyymmdd.slice(0, 4);
    const month = yyyymmdd.slice(4, 6);
    const day = yyyymmdd.slice(6, 8);
    
    return `${year}-${month}-${day}`;
}