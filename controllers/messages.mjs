export default function initMessageController(db) {
  const create = async (request, response) => {
    const worldId = request.params.id;
    const messageInfo = request.body;
    try {
      const world = await db.World.findOne({
        where: {
          id: worldId,
        },
      });

      if (!world) {
        throw new Error('The world is not found! Message not sent!');
      }

      const user = await db.User.findOne({
        where: {
          id: messageInfo.userId,
        },
      });

      if (!user) {
        throw new Error('The user is not found! Message not sent!');
      }

      let newMessage = await db.Message.create({
        userId: messageInfo.userId,
        worldId: messageInfo.room,
        message: messageInfo.message,
        createdAt: messageInfo.date,
        updatedAt: messageInfo.date,
      });

      newMessage = newMessage.dataValues;

      const successMessage = 'Message sent success!';
      response.send({
        ...newMessage,
        type: successMessage,
      });
    } catch (error) {
      const errorMessage = error.message;
      const resObj = {
        error: errorMessage,
        message: errorMessage,
      };
      response.send(resObj);
    }
  };

  const show = async (request, response) => {
    const worldId = request.params.id;
    try {
      let world = await db.World.findOne({
        where: {
          id: worldId,
        },
        include: {
          as: 'worldMessages', // say which group of messages we are getting
          model: db.Message,
          include: {
            as: 'messageSender', // get the receiver of the message
            model: db.User,
          },
        },
        order: [
          [{ model: db.Message, as: 'worldMessages' }, 'createdAt', 'asc'],
        ],
        limit: 100,
      });

      if (!world) {
        throw new Error('The world is not found! Messages not received!');
      }

      world = world.dataValues;
      let messages = world.worldMessages;
      messages = messages.map((message) => message.dataValues);
      messages = messages.map((message) => ({
        ...message,
        messageSender: {
          id: message.messageSender.dataValues.id,
          username: message.messageSender.dataValues.username,
          realName: message.messageSender.dataValues.realName,
          profileImg: message.messageSender.dataValues.profileImg,
          description: message.messageSender.dataValues.description,
          createdAt: message.messageSender.dataValues.createdAt,
          updatedAt: message.messageSender.dataValues.updatedAt,
        },
      }));

      const successMessage = 'Messages received success!';
      response.send({
        message: successMessage,
        messages,
      });
    } catch (error) {
      const errorMessage = error.message;
      const resObj = {
        error: errorMessage,
        message: errorMessage,
      };
      response.send(resObj);
    }
  };

  return {
    create,
    show,
  };
}
