import { check, sleep } from 'k6';
import http from 'k6/http'

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}


const baseUrl="https://api.ajisalit.com"
// const baseUrl="http://localhost:3000"


function generateRandomPassword() {
  return Math.floor(Math.random() * 900000) + 100000;
}

function generateMoroccanPhoneNumber() {
  const prefix = '+2126'
  const number = Math.floor(10000000 + Math.random() * 90000000)
  return prefix + number
}
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
];


export function setup(){
    let body = {
    phoneNumber: generateMoroccanPhoneNumber(),
    password: `${generateRandomPassword()}`,
    Fname:"test",
    Lname: "tessstk6",
    role: "client",
    city: "azrou"
    }
    return body
}

export default function register(){
    let data = setup()
    
    const currentUserAgent = randomItem(userAgents);
    const headers = {
    'User-Agent': currentUserAgent,
     'Content-Type': 'application/json',
  }
    const result = http.post(`${baseUrl}/user/register`,JSON.stringify(data), {headers: headers})
        check(result, {
        'is status 201': (r) => r.status === 201
        });
    console.log('Status:', result.status)
    console.log('Response:', result.body)
    console.log("+++++++++++", result)
  return result
}

