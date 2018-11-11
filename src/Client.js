import { defaultName } from './utils/constants';

export default class Client {
  constructor(name = defaultName, communication) {
    this.name = name;
    this.partner = null;
    this.connection = new RTCPeerConnection();
    this.channel = this.connection.createDataChannel('chat');
    this.communication = communication;
    this.eventsNames = communication.eventsNames;
  }

  async init() {
    document.addEventListener(
      `receivedOfferEvent-${this.name}`,
      this.getOffer.bind(this)
    );
    document.addEventListener(
      `receivedCandidateEvent-${this.name}`,
      this.getCandidate.bind(this)
    );
    document.addEventListener(
      `receivedAnswerEvent-${this.name}`,
      this.getAnswer.bind(this)
    );

    this.connection.addEventListener('iceconnectionstatechange', async e => {

      console.log('connection state for ', this.name, " : ", e.target.iceConnectionState);

      if(this.connectionResolve && this.isConnecting && e.target.iceConnectionState === "completed") {
				this.connectionResolve();
			}
			if (this.connectionResolve && !this.isConnecting && e.target.iceConnectionState === "connected") {
				this.connectionResolve();
			}
    });

    this.connection.addEventListener('icecandidate', async e => {
      if (e.candidate) {
        const { candidate } = e;
        const partner = this.partner;

        this.communication.sendCandidate({
          partner,
          candidate
        });
      }
    });

    // this.connection.ondatachannel = function(event) {
    //   this.channel = event.channel;
		// 	console.log(" ondatachannel ")
		// 	if (this.connectionResolve) {
    //     console.log(" ondatachannel ")
    //     this.connectionResolve(this.channel);
    //   }
    // }.bind(this);
  }

  connect(partner) {
    this.partner = partner;
    this.sendOffer();
    this.isConnecting = true;
    return new Promise(resolve => (this.connectionResolve = resolve));
  }

  sendOffer() {
    const { partner } = this;
    let offer;
    return this.connection
      .createOffer()
      .then(_offer => (offer = _offer))
      .then(() => this.connection.setLocalDescription(offer))
      .then(() => this.communication.sendOffer({ partner, offer }));
  }

  getOffer(msg) {
    const { offer, senderName } = msg.detail;
    let answer;
    this.connection
      .setRemoteDescription(offer)
      .then(() => this.connection.createAnswer())
      .then(_answer => (answer = _answer))
      .then(() => this.connection.setLocalDescription(answer))
      .then(() => this.communication.sendAnswer({ answer, senderName }));
  }

  async getAnswer(msg) {
    const { answer } = msg.detail;
    await this.connection.setRemoteDescription(answer);
  }

  async getCandidate(msg) {
    const { candidate } = msg.detail;
    await this.connection.addIceCandidate(candidate);
  }

  onConnection() {
		return new Promise(resolve => (this.connectionResolve = resolve));
	}
}
