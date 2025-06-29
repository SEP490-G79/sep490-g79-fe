export default function generateCodename(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, "")    
    .trim()
    .split(/\s+/)                  
    .map(word => word[0].toUpperCase()) 
    .join("");                       
}
