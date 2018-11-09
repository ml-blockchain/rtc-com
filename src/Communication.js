import { EventsNames } from './EventsNames';
import { defaultName } from './utils/constants';

export default class Communication {
  constructor({ name, eventNames = new EventsNames() }) {
    this.eventNames = eventNames;
    this.name = name;

    if (name) {
      this.initSocket();
      this.setUniqueEventsNames();
    }

  }

  setName(name) {
    this.name = name;
    this.setUniqueEventsNames();
  }

  initSocket() {
    this.socket = io('http://localhost:3000', {});
    this.socket.emit(this.eventNames.registerClientInServer, this.name);

    this.socket.on(this.eventNames.onOffer, this.getOffer.bind(this));
    this.socket.on(this.eventNames.onCandidate, this.getCandidate.bind(this));
    this.socket.on(this.eventNames.onAnser, this.getAnswer.bind(this));
  }

  setUniqueEventsNames(name = this.name) {
    if (!name) return;

    const {
      receivedOfferEvent,
      receivedCandidateEvent,
      receivedAnswerEvent
    } = this.eventNames;

    this.eventNames.set(receivedOfferEvent, `${receivedOfferEvent}-${name}`);
    this.eventNames.set(
      receivedCandidateEvent,
      `${receivedCandidateEvent}-${name}`
    );
    this.eventNames.set(receivedAnswerEvent, `${receivedAnswerEvent}-${name}`);
    this.eventNames.printEvents();
  }

  sendOffer({ partner, offer }) {
    const { sendOffer: eventName } = this.eventNames;
    const payload = { partner, offer };

    this.socket.emit(eventName, payload);
  }

  sendCandidate({ partner, candidate }) {
    const { sendCandidate: eventName } = this.eventNames;
    const payload = { partner, candidate };

    this.socket.emit(eventName, payload);
  }

  sendAnswer({ answer, senderName }) {
    const { sendAnswer: eventName } = this.eventNames;
    const payLoad = { answer, senderName };

    this.socket.emit(eventName, payLoad);
  }

  getOffer(msg) {
    const { receivedOfferEvent: eventName } = this.eventNames;
    const payload = { detail: msg };

    const event = new CustomEvent(eventName, payload);
    document.dispatchEvent(event);
  }

  getCandidate(msg) {
    const { receivedCandidateEvent: eventName } = this.eventNames;
    const payload = { detail: msg };

    const event = new CustomEvent(eventName, payload);
    document.dispatchEvent(event);
  }

  getAnswer(msg) {
    const { receivedAnswerEvent: eventName } = this.eventNames;
    const payload = { detail: msg };

    const event = new CustomEvent(eventName, payload);
    document.dispatchEvent(event);
  }
}
