import Client from './Client';
import Communication from './Communication';

export function client(name, communication) {
  return new Client(name, communication);
}

export function communication(name) {
  return new Communication(name);
}
