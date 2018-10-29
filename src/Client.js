'use strict';

export default class Client {
  constructor(name) {
    this.socket = io('http://localhost:3000', {});
    this.name = name;
    this.partner = null;
    this.connection = new RTCPeerConnection();
    this.channel = this.connection.createDataChannel('chat');
  }

  async init() {

    this.socket.emit('addClient', this.name);
    this.socket.on('offer', this.getOffer.bind(this));
    this.socket.on('answer', this.getAnswer.bind(this));
    this.socket.on('candidate', this.getCandidate.bind(this));

    this.connection.addEventListener('icecandidate', async e => {
      if (e.candidate) {
        this.socket.emit('candidate', {
          partner: this.partner,
          candidate: e.candidate
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
      .then(() => this.socket.emit('offer', { partner, offer }));
  }

  getOffer(msg) {
    const { offer, senderName } = msg;
    let answer;
    this.connection
      .setRemoteDescription(offer)
      .then(() => this.connection.createAnswer())
      .then(_answer => (answer = _answer))
      .then(() => this.connection.setLocalDescription(answer))
      .then(() => this.socket.emit('answer', { answer, senderName }));
  }

  async getAnswer(msg) {
    const { answer } = msg;
    await this.connection.setRemoteDescription(answer);
  }

  async getCandidate(msg) {
    const { candidate } = msg;
    await this.connection.addIceCandidate(candidate);
  }
}
