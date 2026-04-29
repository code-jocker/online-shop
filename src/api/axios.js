import axios from 'axios';
 const intergate = axios.create({
     baseURL: `${process.env.Base_URL}/api`,
     headers: {'Content-Type': 'application/json'},
     
  
 });
 export default intergate;