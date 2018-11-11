import Client from './Client';
import Communication from './Communication';
import DataChannel from './DataChannel';

export function client(name, communication) {
  return new Client(name, communication);
}

export function communication(name) {
  return new Communication(name);
}
export function dataChannel(connection) {
  return new DataChannel(connection);
}
