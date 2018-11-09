export default class Client {
  constructor(name, comm) {
    this.socket = io('http://localhost:3000', {});
    this.name = name;
    this.partner = null;
    this.connection = new RTCPeerConnection();
    this.channel = this.connection.createDataChannel('chat');
    this.comm = comm;
    this.eventsNames = comm.eventsNames;
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

    this.connection.addEventListener('icecandidate', async e => {
      if (e.candidate) {
        const { candidate } = e;
        const partner = this.partner;

        this.comm.sendCandidate({
          partner,
          candidate
        });
      }
    });

    this.channel.onopen = event => {
      const readyState = this.channel.readyState;
      if (readyState === 'open' && this.partner) {
        this.connectionResolve(this.channel);
      }
    };

    this.connection.ondatachannel = function(event) {
      this.channel = event.channel;
      if (this.isListen) {
        this.connectionResolve(this.channel);
      }
    }.bind(this);
  }

  connect(partner) {
    this.partner = partner;
    this.sendOffer();
    return new Promise((resolve, reject) => {
      this.connectionResolve = resolve;
    });
  }

  listen() {
    this.isListen = true;
    return new Promise((resolve, reject) => {
      this.connectionResolve = resolve;
    });
  }

  sendOffer() {
    const { partner } = this;
    let offer;
    return this.connection
      .createOffer()
      .then(_offer => (offer = _offer))
      .then(() => this.connection.setLocalDescription(offer))
      .then(() => this.comm.sendOffer({ partner, offer }));
  }

  getOffer(msg) {
    const { offer, senderName } = msg.detail;
    let answer;
    this.connection
      .setRemoteDescription(offer)
      .then(() => this.connection.createAnswer())
      .then(_answer => (answer = _answer))
      .then(() => this.connection.setLocalDescription(answer))
      .then(() => this.comm.sendAnswer({ answer, senderName }));
  }

  async getAnswer(msg) {
    const { answer } = msg.detail;
    await this.connection.setRemoteDescription(answer);
  }

  async getCandidate(msg) {
    const { candidate } = msg.detail;
    await this.connection.addIceCandidate(candidate);
  }
}
