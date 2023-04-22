import SessionToken from '../models/sessionToken'

const sessionController = {
  async findUser(from) {
    try {
      let stage;
      const conversation = await SessionToken.exists({from: from})
      if(!conversation) {
        await new SessionToken({from: from, stage: 1}).save();
      }
      else {
        stage = conversation.stage;
      }
    }
    catch(err) {
      console.log(err);
    }
  }
}