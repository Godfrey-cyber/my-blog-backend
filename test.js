import dns from "dns"
 
// const website = 'geeksforgeeks.org';
// // Call to lookup function of dns
// dns.lookup(website, (err, address, family) => {
//     console.log(`Address for ${website} is ${address}: IPv${family}`);
// });

// console.log(dns.getServers());

// # DOMAUIN NAME SYSTEM
// 1. lookup()
// # The first is the domain we want to lookup, which can be anything and is knowledgehut.com in our case. The second is the callback or function that we want to run, once the lookup is complete. 
// #The function that runs on completion takes two arguments. The first argument contains an error, if one occurs, and the second is the value or the IP address of the domain. 

 
// dns.lookup('google.com', (err, info) => { 
//     if(err) { 
//         console.log(err); 
//         return; 
//     } 
//     console.log({info}); 
// }) 

// 2. resolve() 
// #The function resolve() is pretty much identical to the lookup() function. Our code remains the same and we have only changed the lookup to resolve. Add the below code in a dns.js file.
// #The resolve function actually goes and makes a network request to the DNS system, to see how many IP addresses are registered with that domain name. The lookup function actually just uses the computer’s internal mechanism first to see if there is an IP address that it can return without having to do a network request. 

// #So, resolve function is more accurate and should be used in production as it gives all the IP addresses associated with the domain. 
// dns.resolve('gmail.com', (err, value) => { 
//     if(err) { 
//         console.log(err); 
//         return; 
//     } 
//     console.log(value); 
// }) 

// #You can also provide another argument to the resolve function to specify what type of record you want to look up. For example, with the DNS system you can find the Mail exchange record of the domain. This record handles the request, when you send an email to the domain, and specifies which server should handle the request.
// #dns.resolve('knowledgehut.com', 'MX', (err, value) => { 
//     if(err) { 
//         console.log(err); 
//         return; 
//     } 
//     console.log(value); 
// })
// 
