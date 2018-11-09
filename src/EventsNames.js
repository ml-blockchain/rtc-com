import { communicationEventsNames } from './utils/constants';

export class EventsNames {
  constructor() {
    this.sendOffer = communicationEventsNames.sendOffer;
    this.sendAnswer = communicationEventsNames.sendAnswer;
    this.sendCandidate = communicationEventsNames.sendCandidate;
    this.receivedAnswerEvent = communicationEventsNames.receivedAnswerEvent;
    this.receivedCandidateEvent =
      communicationEventsNames.receivedCandidateEvent;
    this.receivedOfferEvent = communicationEventsNames.receivedOfferEvent;
    this.onOffer = communicationEventsNames.onOffer;
    this.onAnser = communicationEventsNames.onAnswer;
    this.onCandidate = communicationEventsNames.onCandidate;
    this.registerClientInServer =
      communicationEventsNames.registerClientInServer;
  }

  set(name, value) {
    if (this[name]) {
      this[name] = value;
    }
  }

  printEvents() {
    console.log(this);
  }
}
