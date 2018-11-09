import keymirror from 'keymirror';

export const communicationEventsNames = keymirror({
  sendOffer: null,
  sendAnswer: null,
  sendCandidate: null,
  receivedAnswerEvent: null,
  receivedCandidateEvent: null,
  receivedOfferEvent: null,
  onOffer: null,
  onAnswer: null,
  onCandidate: null,
  registerClientInServer: null
});

export const defaultName = 'defaultName';
