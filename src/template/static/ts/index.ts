import { config } from './config';
import { sayHello } from "./greet";

console.log(config);
console.log(sayHello("TypeScript24"));

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript5");
